
import React from 'react';
import { Question } from '@/types/test';
import QuestionDisplay from './QuestionDisplay';
import TestControls from './TestControls';
import QuestionNavigation from './QuestionNavigation';

interface TestContentProps {
  currentQuestion: Question;
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswers: Record<string, string>;
  questions: Question[];
  onAnswerSelection: (questionId: string, optionId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  onNavigate: (index: number) => void;
}

const TestContent: React.FC<TestContentProps> = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswers,
  questions,
  onAnswerSelection,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting,
  onNavigate
}) => {
  return (
    <>
      <QuestionDisplay
        question={currentQuestion}
        selectedOptionId={selectedAnswers[currentQuestion.id] || ''}
        onOptionSelect={onAnswerSelection}
      />
      
      <TestControls
        onPrevious={onPrevious}
        onNext={onNext}
        onSubmit={onSubmit}
        isFirstQuestion={currentQuestionIndex === 0}
        isLastQuestion={currentQuestionIndex === totalQuestions - 1}
        isSubmitting={isSubmitting}
      />

      <QuestionNavigation
        questions={questions}
        currentIndex={currentQuestionIndex}
        answeredQuestions={selectedAnswers}
        onNavigate={onNavigate}
      />
    </>
  );
};

export default TestContent;
