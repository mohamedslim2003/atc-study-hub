
import React from 'react';
import { Test, Answer } from '@/types/test';
import TestResults from './TestResults';

interface TestResultsDisplayProps {
  test: Test;
  testResults: {
    score: number;
    totalQuestions: number;
    answers: Answer[];
  };
  testComplete: boolean;
}

const TestResultsDisplay: React.FC<TestResultsDisplayProps> = ({ 
  test, 
  testResults,
  testComplete 
}) => {
  if (!testComplete || !testResults) {
    return null;
  }

  return <TestResults test={test} testResults={testResults} />;
};

export default TestResultsDisplay;
