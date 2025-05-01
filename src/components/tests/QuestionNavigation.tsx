
import React from 'react';
import { Button } from '@/components/ui-custom/Button';
import { Question } from '@/types/test';

interface QuestionNavigationProps {
  questions: Question[];
  currentIndex: number;
  answeredQuestions: Record<string, string>;
  onNavigate: (index: number) => void;
}

const QuestionNavigation: React.FC<QuestionNavigationProps> = ({
  questions,
  currentIndex,
  answeredQuestions,
  onNavigate
}) => {
  return (
    <div className="pt-4">
      <h4 className="text-sm font-medium mb-2">Quick Navigation</h4>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <Button 
            key={index} 
            variant="outline"
            size="sm"
            className={`w-10 h-10 p-0 ${
              answeredQuestions[question.id] ? 'bg-primary/10' : ''
            } ${currentIndex === index ? 'ring-2 ring-primary' : ''}`}
            onClick={() => onNavigate(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuestionNavigation;
