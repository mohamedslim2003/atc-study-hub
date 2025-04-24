
export interface Test {
  id: string;
  title: string;
  description: string;
  duration: number;
  category: 'fundamentals' | 'advanced' | 'airspace' | 'emergency';
  questions: Question[];
  courseId?: string;
  courseName?: string;
  fileData?: string;
  fileType?: string;
  fileName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
}

export interface Option {
  id: string;
  text: string;
}

export interface TestSubmission {
  id: string;
  testId: string;
  userId: string;
  answers: Answer[];
  score: number;
  totalQuestions: number;
  submittedAt: Date;
}

export interface Answer {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}
