
import React from 'react';
import { Question } from '@/types/test';
import { Card } from '@/components/ui-custom/Card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuestionDisplayProps {
  question: Question;
  selectedOptionId: string;
  onOptionSelect: (questionId: string, optionId: string) => void;
}

const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedOptionId,
  onOptionSelect
}) => {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">{question.text}</h3>
        
        <RadioGroup
          value={selectedOptionId}
          onValueChange={(value) => onOptionSelect(question.id, value)}
          className="space-y-3"
        >
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="cursor-pointer">{option.text}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </Card>
  );
};

export default QuestionDisplay;
