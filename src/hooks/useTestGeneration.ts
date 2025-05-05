
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
    
    // Create 50 questions for the test
    for (let i = 0; i < 50 && i < categoryQuestions.length; i++) {
      const q = categoryQuestions[i];
      
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
