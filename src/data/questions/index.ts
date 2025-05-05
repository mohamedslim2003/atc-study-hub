
import { aerodromeQuestions } from './aerodromeQuestions';
import { approachQuestions } from './approachQuestions';
import { ccrQuestions } from './ccrQuestions';

export { aerodromeQuestions, approachQuestions, ccrQuestions };

// Export a mapping of categories to their question data
export const questionsByCategory = {
  'aerodrome': aerodromeQuestions,
  'approach': approachQuestions,
  'ccr': ccrQuestions
};

export type CategoryType = 'aerodrome' | 'approach' | 'ccr';
