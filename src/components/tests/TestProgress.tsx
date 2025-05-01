
import React from 'react';
import { Progress } from '@/components/ui/progress';

interface TestProgressProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredQuestions: number;
}

const TestProgress: React.FC<TestProgressProps> = ({
  currentQuestionIndex,
  totalQuestions,
  answeredQuestions
}) => {
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>
      </div>
      
      <Progress value={progress} className="h-1" />
      
      <div className="flex justify-between text-sm text-muted-foreground">
        <div>Answered: {answeredQuestions}/{totalQuestions}</div>
        <div>Remaining: {totalQuestions - answeredQuestions}</div>
      </div>
    </>
  );
};

export default TestProgress;
