
import React from 'react';
import { Test, Answer } from '@/types/test';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui-custom/Button';
import { Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTestGeneration } from '@/hooks/useTestGeneration';

interface TestResultsProps {
  test: Test;
  testResults: {
    score: number;
    totalQuestions: number;
    answers: Answer[];
  };
}

const TestResults: React.FC<TestResultsProps> = ({ test, testResults }) => {
  const navigate = useNavigate();
  const { assessLevel } = useTestGeneration();
  
  // Calculate score on a scale of 0-20
  const correctAnswers = testResults.answers.filter(a => a.isCorrect).length;
  const scoreOutOf20 = Math.round((correctAnswers / testResults.totalQuestions) * 20);
  
  // Get level assessment
  const levelAssessment = assessLevel(scoreOutOf20);

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
              <h2 className="text-3xl font-bold">{scoreOutOf20}/20</h2>
              <p className="text-muted-foreground">
                {correctAnswers} out of {testResults.totalQuestions} correct
              </p>
              <div className="mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                style={{
                  backgroundColor: levelAssessment.level === 4 ? "rgb(34, 197, 94, 0.1)" :
                                  levelAssessment.level === 3 ? "rgb(59, 130, 246, 0.1)" :
                                  levelAssessment.level === 2 ? "rgb(245, 158, 11, 0.1)" :
                                  "rgb(239, 68, 68, 0.1)",
                  color: levelAssessment.level === 4 ? "rgb(34, 197, 94)" :
                         levelAssessment.level === 3 ? "rgb(59, 130, 246)" :
                         levelAssessment.level === 2 ? "rgb(245, 158, 11)" :
                         "rgb(239, 68, 68)"
                }}>
                Level {levelAssessment.level}: {levelAssessment.description}
              </div>
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
};

export default TestResults;
