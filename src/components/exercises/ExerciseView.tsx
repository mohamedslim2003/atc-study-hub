
import React, { useState } from 'react';
import { Exercise, ExerciseAnswer } from '@/types/exercise';
import { submitExercise } from '@/services/exerciseService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui-custom/Button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle } from 'lucide-react';

interface ExerciseViewProps {
  exercise: Exercise;
  onComplete?: () => void;
}

const ExerciseView: React.FC<ExerciseViewProps> = ({ exercise, onComplete }) => {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [exerciseComplete, setExerciseComplete] = useState(false);

  const handleAnswerSelection = (questionId: string, optionId: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < exercise.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitExercise = async () => {
    if (!user) {
      toast.error("You need to be logged in to submit an exercise");
      return;
    }

    setIsSubmitting(true);

    // Create answers array
    const answers: ExerciseAnswer[] = exercise.questions.map(question => ({
      questionId: question.id,
      selectedOptionId: selectedAnswers[question.id] || ''
    }));

    try {
      await submitExercise({
        exerciseId: exercise.id,
        userId: user.id,
        answers
      });

      setExerciseComplete(true);
      toast.success("Exercise completed successfully!");

      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error submitting exercise:", error);
      toast.error("Failed to submit exercise. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = exercise.questions[currentQuestionIndex];
  const answeredQuestions = Object.keys(selectedAnswers).length;
  const totalQuestions = exercise.questions.length;
  const progress = (answeredQuestions / totalQuestions) * 100;

  // Display completion message if exercise is complete
  if (exerciseComplete) {
    return (
      <Card className="text-center">
        <CardContent className="p-8">
          <div className="inline-flex h-16 w-16 rounded-full bg-green-100 items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Exercise Completed!</h3>
          <p className="text-muted-foreground mb-4">
            You have successfully completed the "{exercise.title}" exercise.
          </p>
          <p className="text-sm text-muted-foreground">
            Your answers have been saved. You can practice again anytime!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{exercise.title}</h2>
          <p className="text-muted-foreground">{exercise.description}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Question</p>
          <p className="text-2xl font-bold">{currentQuestionIndex + 1}/{totalQuestions}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span>{answeredQuestions}/{totalQuestions} answered</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Question {currentQuestionIndex + 1}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-medium">{currentQuestion.text}</h3>
          
          <RadioGroup
            value={selectedAnswers[currentQuestion.id] || ''}
            onValueChange={(value) => handleAnswerSelection(currentQuestion.id, value)}
            className="space-y-3"
          >
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <RadioGroupItem value={option.id} id={option.id} />
                <Label htmlFor={option.id} className="cursor-pointer flex-1">
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <Card>
        <CardContent className="p-4">
          <h4 className="text-sm font-medium mb-3">Quick Navigation</h4>
          <div className="flex flex-wrap gap-2">
            {exercise.questions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={`w-10 h-10 p-0 ${
                  selectedAnswers[question.id] ? 'bg-primary/10' : ''
                } ${currentQuestionIndex === index ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                {selectedAnswers[question.id] ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {currentQuestionIndex === totalQuestions - 1 ? (
            <Button
              onClick={handleSubmitExercise}
              disabled={isSubmitting || answeredQuestions === 0}
            >
              {isSubmitting ? 'Submitting...' : 'Complete Exercise'}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={currentQuestionIndex === totalQuestions - 1}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExerciseView;
