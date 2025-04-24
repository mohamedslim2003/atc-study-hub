
import React, { useState } from 'react';
import { Test, Question, Answer } from '@/types/test';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui-custom/Button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Clock, Trophy } from 'lucide-react';
import { submitTest } from '@/services/testService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

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
  
  const [timeRemaining, setTimeRemaining] = useState(test.duration * 60); // in seconds
  const [timerRunning, setTimerRunning] = useState(true);
  
  // Handle timer
  React.useEffect(() => {
    if (!timerRunning) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerRunning(false);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timerRunning]);
  
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours > 0 ? `${hours}:` : '',
      `${minutes.toString().padStart(2, '0')}:`,
      secs.toString().padStart(2, '0')
    ].join('');
  };
  
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
  
  const handleSubmitTest = () => {
    if (!user) {
      toast.error("You need to be logged in to submit a test");
      return;
    }
    
    setIsSubmitting(true);
    setTimerRunning(false);
    
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
  
  const currentQuestion = test.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / test.questions.length) * 100;

  // Test results view
  if (testComplete && testResults) {
    return (
      <div className="space-y-8 animate-enter">
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center py-6 space-y-4">
              <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center">
                <h2 className="text-3xl font-bold">{Math.round(testResults.score)}%</h2>
                <p className="text-muted-foreground">
                  {testResults.answers.filter(a => a.isCorrect).length} out of {testResults.totalQuestions} correct
                </p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h3 className="font-semibold text-lg">Question Review</h3>
              
              {test.questions.map((question, index) => {
                const answer = testResults.answers.find(a => a.questionId === question.id);
                const isCorrect = answer?.isCorrect;
                const selectedOption = question.options.find(o => o.id === answer?.selectedOptionId);
                const correctOption = question.options.find(o => o.id === question.correctOptionId);
                
                return (
                  <Card key={question.id} className={
                    isCorrect 
                      ? "border-green-500/20 bg-green-50/30 dark:bg-green-900/10" 
                      : "border-red-500/20 bg-red-50/30 dark:bg-red-900/10"
                  }>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Question {index + 1}</h4>
                        {isCorrect ? (
                          <span className="text-green-600 text-sm font-medium">Correct</span>
                        ) : (
                          <span className="text-red-600 text-sm font-medium">Incorrect</span>
                        )}
                      </div>
                      
                      <p className="text-sm">{question.text}</p>
                      
                      <div className="space-y-2 pl-4">
                        {question.options.map((option) => (
                          <div 
                            key={option.id} 
                            className={`p-2 rounded-md text-sm ${
                              option.id === question.correctOptionId 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-100" 
                                : option.id === answer?.selectedOptionId && !isCorrect
                                  ? "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-100"
                                  : ""
                            }`}
                          >
                            {option.text}
                            {option.id === question.correctOptionId && (
                              <span className="ml-2 text-xs">(Correct Answer)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            
            <div className="flex justify-center pt-4">
              <Button onClick={() => navigate('/dashboard/tests')}>
                Return to Tests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Timer and progress */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span className={`font-mono ${timeRemaining < 60 ? 'text-red-600 animate-pulse' : ''}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
        
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {test.questions.length}
        </div>
      </div>
      
      <Progress value={progress} className="h-1" />
      
      {/* Current question */}
      <Card className="p-6">
        <div className="space-y-6">
          <h3 className="text-lg font-medium">{currentQuestion.text}</h3>
          
          <RadioGroup
            value={selectedAnswers[currentQuestion.id] || ''}
            onValueChange={(value) => handleAnswerSelection(currentQuestion.id, value)}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="cursor-pointer">{option.text}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </Card>
      
      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button 
          onClick={handlePrevious} 
          variant="outline"
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        {currentQuestionIndex < test.questions.length - 1 ? (
          <Button onClick={handleNext}>Next</Button>
        ) : (
          <Button 
            onClick={handleSubmitTest}
            isLoading={isSubmitting}
          >
            Submit Test
          </Button>
        )}
      </div>
    </div>
  );
};

export default TestView;
