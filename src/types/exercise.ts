
export interface Exercise {
  id: string;
  title: string;
  description: string;
  category: 'aerodrome' | 'approach' | 'ccr' | 'uncategorized';
  questions: ExerciseQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseQuestion {
  id: string;
  text: string;
  options: ExerciseOption[];
  correctOptionId: string;
}

export interface ExerciseOption {
  id: string;
  text: string;
}

export interface ExerciseSubmission {
  id: string;
  exerciseId: string;
  userId: string;
  answers: ExerciseAnswer[];
  completedAt: Date;
}

export interface ExerciseAnswer {
  questionId: string;
  selectedOptionId: string;
}
