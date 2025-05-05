
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { getTests, getUserTestSubmissions, createTest } from '@/services/testService';
import { Test, TestSubmission } from '@/types/test';
import { CategoryType } from '@/data/questions';
import { useTestGeneration } from '@/hooks/useTestGeneration';
import { QuickTestFormData } from '@/components/tests/QuickTestForm';

export function useTestManagement() {
  const [tests, setTests] = useState<Test[]>([]);
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [showViewTestDialog, setShowViewTestDialog] = useState(false);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, isAdmin } = useAuth();
  const { generateQuestionsForCategory } = useTestGeneration();

  // Fetch tests and user submissions
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const allTests = getTests();
        console.log("Fetched tests:", allTests);
        setTests(allTests);
        
        if (user) {
          const userSubmissions = getUserTestSubmissions(user.id);
          setSubmissions(userSubmissions);
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
        toast.error("Failed to load tests");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  // Handle category selection for non-admin users
  useEffect(() => {
    console.log("Category selection effect running with category:", selectedCategory);
    
    if (selectedCategory && !isAdmin) {
      console.log("Processing category selection:", selectedCategory);
      
      // Find tests for the selected category
      const categoryTests = tests.filter(test => test.category === selectedCategory);
      console.log("Found category tests:", categoryTests);
      
      if (categoryTests.length === 0) {
        // Create a test for this category automatically
        console.log("No tests found for category, generating new test");
        generateTestForCategory(selectedCategory);
      } else {
        // Use the first test found for this category
        console.log("Using existing test:", categoryTests[0]);
        setSelectedTest(categoryTests[0]);
        setShowViewTestDialog(true);
      }
    }
  }, [selectedCategory, tests, isAdmin]);

  const generateTestForCategory = (category: CategoryType) => {
    console.log(`Generating test for category: ${category}`);
    const questions = generateQuestionsForCategory(category);
    
    try {
      const newTest = createTest({
        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Test`,
        description: `50-question test on ${category} topics with a 30-minute time limit.`,
        duration: 30, // 30 minutes
        category: category,
        questions: questions
      });
      
      console.log("New test created:", newTest);
      
      // Add the new test to our state
      setTests(prevTests => [...prevTests, newTest]);
      
      // Select the test and show it
      setSelectedTest(newTest);
      setShowViewTestDialog(true);
      
      toast.success(`${category.charAt(0).toUpperCase() + category.slice(1)} test created successfully!`);
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error(`Failed to create ${category} test`);
    }
  };

  const handleQuickCreate = (data: QuickTestFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create a question from the form data
      const options = data.options.map((text, index) => ({
        id: `q1o${index + 1}`,
        text
      }));

      const question = {
        id: 'q1',
        text: data.question,
        options,
        correctOptionId: `q1o${data.correctOptionIndex + 1}`
      };

      // Create the test with our single question
      const newTest = createTest({
        title: data.title,
        description: data.description,
        duration: data.duration,
        category: data.category,
        questions: [question]
      });
      
      // Refresh the tests list
      setTests(prevTests => [...prevTests, newTest]);
      toast.success("Test created successfully!");
      setShowQuickCreate(false);
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error("Failed to create test");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewTest = (test: Test) => {
    setSelectedTest(test);
    setShowViewTestDialog(true);
  };
  
  const handleCreateTestClick = () => {
    setShowQuickCreate(!showQuickCreate);
  };

  const handleCategorySelect = (category: CategoryType) => {
    console.log("Category selected:", category);
    setSelectedCategory(category);
  };
  
  const handleTestComplete = () => {
    // Refresh submissions after test completion
    if (user) {
      const userSubmissions = getUserTestSubmissions(user.id);
      setSubmissions(userSubmissions);
    }
  };

  // Calculate stats
  const completedTests = submissions.length;
  const averageScore = submissions.length > 0
    ? Math.round(submissions.reduce((sum, sub) => sum + sub.score, 0) / submissions.length)
    : 0;
  const nextScheduledTest = tests.length > 0 ? "Today" : "No tests available";

  return {
    tests,
    submissions,
    selectedTest,
    showViewTestDialog,
    showQuickCreate,
    selectedCategory,
    isLoading,
    isSubmitting,
    completedTests,
    averageScore,
    nextScheduledTest,
    handleQuickCreate,
    handleViewTest,
    handleCreateTestClick,
    handleCategorySelect,
    handleTestComplete,
    setShowViewTestDialog,
    setSelectedTest,
    setShowQuickCreate
  };
}
