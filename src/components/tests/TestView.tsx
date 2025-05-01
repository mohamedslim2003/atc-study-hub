
import React, { useState } from 'react';
import { Test, Answer } from '@/types/test';
import { submitTest } from '@/services/testService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Import our refactored components
import TestResults from '@/components/tests/TestResults';
import TestTimer from '@/components/tests/TestTimer';
import QuestionDisplay from '@/components/tests/QuestionDisplay';
import QuestionNavigation from '@/components/tests/QuestionNavigation';
import TestControls from '@/components/tests/TestControls';
import TestProgress from '@/components/tests/TestProgress';
import { useTestTimer } from '@/hooks/useTestTimer';

interface TestViewProps {
  test: Test;
  onComplete?: () => void;
}

const TestView: React.FC<TestViewProps> = ({ test, onComplete }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testComplete, setTestComplete] = useState(false);
  const [testResults, setTestResults] = useState<{
    score: number;
    totalQuestions: number;
    answers: Answer[];
  } | null>(null);
  
  const handleSubmitTest = () => {
    if (!user) {
      toast.error("You need to be logged in to submit a test");
      return;
    }
    
    setIsSubmitting(true);
    stopTimer();
    
    // Calculate answers and score
    const answers: Answer[] = test.questions.map(question => {
      const selectedOptionId = selectedAnswers[question.id] || '';
      const isCorrect = selectedOptionId === question.correctOptionId;
      
      return {
        questionId: question.id,
        selectedOptionId,
        isCorrect
      };
    });
    
    const correctAnswers = answers.filter(a => a.isCorrect).length;
    const score = (correctAnswers / test.questions.length) * 100;
    
    try {
      // Submit the test
      submitTest({
        testId: test.id,
        userId: user.id,
        answers,
        score,
        totalQuestions: test.questions.length
      });
      
      // Set test results for display
      setTestResults({
        score,
        totalQuestions: test.questions.length,
        answers
      });
      
      setTestComplete(true);
      toast.success("Test submitted successfully");
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error submitting test:", error);
      toast.error("Failed to submit test. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const { timeRemaining, isTimeWarning, stopTimer } = useTestTimer({
    duration: test.duration,
    onTimeUp: handleSubmitTest
  });
  
  const handleAnswerSelection = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  const currentQuestion = test.questions[currentQuestionIndex];
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const totalQuestions = test.questions.length;

  // Test results view
  if (testComplete && testResults) {
    return <TestResults test={test} testResults={testResults} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <TestTimer timeRemaining={timeRemaining} isTimeWarning={isTimeWarning} />
      </div>
      
      <TestProgress
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        answeredQuestions={answeredQuestions}
      />
      
      <QuestionDisplay
        question={currentQuestion}
        selectedOptionId={selectedAnswers[currentQuestion.id] || ''}
        onOptionSelect={handleAnswerSelection}
      />
      
      <TestControls
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmitTest}
        isFirstQuestion={currentQuestionIndex === 0}
        isLastQuestion={currentQuestionIndex === test.questions.length - 1}
        isSubmitting={isSubmitting}
      />

      <QuestionNavigation
        questions={test.questions}
        currentIndex={currentQuestionIndex}
        answeredQuestions={selectedAnswers}
        onNavigate={setCurrentQuestionIndex}
      />
    </div>
  );
};

export default TestView;
