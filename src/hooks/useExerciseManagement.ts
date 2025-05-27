
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getExercises, getUserExerciseSubmissions, createExercise } from '@/services/exerciseService';
import { Exercise, ExerciseSubmission } from '@/types/exercise';
import { CategoryType } from '@/data/questions';
import { useExerciseGeneration } from '@/hooks/useExerciseGeneration';

export function useExerciseManagement() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [submissions, setSubmissions] = useState<ExerciseSubmission[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showViewExerciseDialog, setShowViewExerciseDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user } = useAuth();
  const { generateQuestionsForCategory } = useExerciseGeneration();

  // Fetch exercises and user submissions
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const allExercises = await getExercises();
        console.log("Fetched exercises:", allExercises);
        setExercises(allExercises);
        
        if (user) {
          const userSubmissions = await getUserExerciseSubmissions(user.id);
          setSubmissions(userSubmissions);
        }
        
        toast.success("Exercises loaded successfully");
      } catch (error) {
        console.error("Error fetching exercises:", error);
        toast.error("Failed to load exercises. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Handle category selection
  useEffect(() => {
    console.log("Category selection effect running with category:", selectedCategory);
    
    if (selectedCategory) {
      console.log("Processing category selection:", selectedCategory);
      
      // Find exercises for the selected category
      const categoryExercises = exercises.filter(exercise => exercise.category === selectedCategory);
      console.log("Found category exercises:", categoryExercises);
      
      if (categoryExercises.length === 0) {
        // Create an exercise for this category automatically
        console.log("No exercises found for category, generating new exercise");
        toast.info(`Generating ${selectedCategory} exercise. This may take a moment...`);
        generateExerciseForCategory(selectedCategory);
      } else {
        // Use the first exercise found for this category
        console.log("Using existing exercise:", categoryExercises[0]);
        setSelectedExercise(categoryExercises[0]);
        setShowViewExerciseDialog(true);
        toast.info(`${selectedCategory} exercise loaded`);
      }
    }
  }, [selectedCategory, exercises]);

  const generateExerciseForCategory = async (category: CategoryType) => {
    console.log(`Generating exercise for category: ${category}`);
    const questions = generateQuestionsForCategory(category);
    
    try {
      const newExercise = await createExercise({
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Practice`,
        description: `Practice exercise with 10 questions on ${category} topics.`,
        category: category,
        questions: questions
      });
      
      console.log("New exercise created:", newExercise);
      
      // Add the new exercise to our state
      setExercises(prevExercises => [...prevExercises, newExercise]);
      
      // Select the exercise and show it
      setSelectedExercise(newExercise);
      setShowViewExerciseDialog(true);
      
      toast.success(`${category.charAt(0).toUpperCase() + category.slice(1)} exercise created successfully!`);
    } catch (error) {
      console.error("Error creating exercise:", error);
      toast.error(`Failed to create ${category} exercise. Please try again.`);
    }
  };

  const handleViewExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowViewExerciseDialog(true);
    toast.info(`Loading "${exercise.title}"...`);
  };

  const handleCategorySelect = (category: CategoryType) => {
    console.log("Category selected:", category);
    setSelectedCategory(category);
    toast.info(`Loading ${category} exercise...`);
  };
  
  const handleExerciseComplete = () => {
    // Refresh submissions after exercise completion
    if (user) {
      getUserExerciseSubmissions(user.id).then(userSubmissions => {
        setSubmissions(userSubmissions);
        toast.success("Exercise completed! Your answers have been saved.");
      });
    }
  };

  // Calculate stats
  const completedExercises = submissions.length;
  const inProgressExercises = exercises.length - completedExercises;

  return {
    exercises,
    submissions,
    selectedExercise,
    showViewExerciseDialog,
    selectedCategory,
    isLoading,
    completedExercises,
    inProgressExercises,
    handleViewExercise,
    handleCategorySelect,
    handleExerciseComplete,
    setShowViewExerciseDialog,
    setSelectedExercise
  };
}
