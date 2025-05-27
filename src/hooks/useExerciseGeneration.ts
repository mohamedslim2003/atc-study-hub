
import { ExerciseQuestion, ExerciseOption } from '@/types/exercise';
import { questionsByCategory, CategoryType } from '@/data/questions';

export const useExerciseGeneration = () => {
  const generateQuestionsForCategory = (category: CategoryType): ExerciseQuestion[] => {
    const questions: ExerciseQuestion[] = [];
    
    // Get questions data for the selected category
    const categoryQuestions = questionsByCategory[category] || [];
    if (categoryQuestions.length === 0) {
      console.error(`No questions available for category: ${category}`);
      return questions;
    }
    
    // Create exactly 10 questions for the exercise
    const totalQuestionsToCreate = Math.min(10, categoryQuestions.length);
    
    for (let i = 0; i < totalQuestionsToCreate; i++) {
      // Use modulo to cycle through available questions if needed
      const questionIndex = i % categoryQuestions.length;
      const q = categoryQuestions[questionIndex];
      
      // Create question object
      const options: ExerciseOption[] = q.options.map((text, index) => ({
        id: `q${i+1}o${index+1}`,
        text
      }));
      
      const question: ExerciseQuestion = {
        id: `q${i+1}`,
        text: q.question,
        options,
        correctOptionId: `q${i+1}o${q.correctIndex+1}`
      };
      
      questions.push(question);
    }
    
    return questions;
  };

  return { generateQuestionsForCategory };
};
