
import React from 'react';
import TestTimer from './TestTimer';
import TestProgress from './TestProgress';

interface TestHeaderProps {
  timeRemaining: number;
  isTimeWarning: boolean;
  currentQuestionIndex: number;
  totalQuestions: number;
  answeredQuestions: number;
}

const TestHeader: React.FC<TestHeaderProps> = ({
  timeRemaining,
  isTimeWarning,
  currentQuestionIndex,
  totalQuestions,
  answeredQuestions
}) => {
  return (
    <>
      <div className="flex justify-between items-center">
        <TestTimer timeRemaining={timeRemaining} isTimeWarning={isTimeWarning} />
      </div>
      
      <TestProgress
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        answeredQuestions={answeredQuestions}
      />
    </>
  );
};

export default TestHeader;
