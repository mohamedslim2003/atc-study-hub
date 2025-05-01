
import React from 'react';
import { Button } from '@/components/ui-custom/Button';

interface TestControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  isSubmitting: boolean;
}

const TestControls: React.FC<TestControlsProps> = ({
  onPrevious,
  onNext,
  onSubmit,
  isFirstQuestion,
  isLastQuestion,
  isSubmitting
}) => {
  return (
    <div className="flex justify-between pt-4">
      <Button 
        onClick={onPrevious} 
        variant="outline"
        disabled={isFirstQuestion}
      >
        Previous
      </Button>
      
      {!isLastQuestion ? (
        <Button onClick={onNext}>Next</Button>
      ) : (
        <Button 
          onClick={onSubmit}
          isLoading={isSubmitting}
        >
          Submit Test
        </Button>
      )}
    </div>
  );
};

export default TestControls;
