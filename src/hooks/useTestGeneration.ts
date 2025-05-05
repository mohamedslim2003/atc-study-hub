
import { Question, Option } from '@/types/test';
import { questionsByCategory, CategoryType } from '@/data/questions';
import { assessLevel } from '@/utils/levelAssessment';

export const useTestGeneration = () => {
  const generateQuestionsForCategory = (category: CategoryType): Question[] => {
    const questions: Question[] = [];
    
    // Get questions data for the selected category
    const categoryQuestions = questionsByCategory[category] || [];
    if (categoryQuestions.length === 0) {
      console.error(`No questions available for category: ${category}`);
      return questions;
    }
    
    // Determine how many questions to create (exactly 50, or all available if less than 50)
    const totalQuestionsToCreate = Math.min(50, categoryQuestions.length);
    
    // Create exactly 50 questions for the test (or all available if less than 50)
    // If there are fewer than 50 questions available, we'll cycle through them
    for (let i = 0; i < 50; i++) {
      // Use modulo to cycle through available questions if needed
      const questionIndex = i % categoryQuestions.length;
      const q = categoryQuestions[questionIndex];
      
      // Create question object
      const options: Option[] = q.options.map((text, index) => ({
        id: `q${i+1}o${index+1}`,
        text
      }));
      
      const question: Question = {
        id: `q${i+1}`,
        text: q.question,
        options,
        correctOptionId: `q${i+1}o${q.correctIndex+1}`
      };
      
      questions.push(question);
    }
    
    return questions;
  };

  return { generateQuestionsForCategory, assessLevel };
};
