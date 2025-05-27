
import React from 'react';
import { Card, CardContent } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui-custom/Button';
import { CategoryType } from '@/data/questions';

interface ExerciseCategoryFiltersProps {
  selectedCategory: CategoryType | null;
  onSelectCategory: (category: CategoryType) => void;
}

const categories: { value: CategoryType; label: string; description: string }[] = [
  {
    value: 'aerodrome',
    label: 'Aerodrome',
    description: 'Ground control and airport operations'
  },
  {
    value: 'approach',
    label: 'Approach',
    description: 'Approach control procedures'
  },
  {
    value: 'ccr',
    label: 'CCR',
    description: 'Control Center Region operations'
  }
];

const ExerciseCategoryFilters: React.FC<ExerciseCategoryFiltersProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4">Practice Categories</h2>
        <p className="text-muted-foreground mb-6">
          Choose a category to start practicing. Each exercise contains 10 questions.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              className="h-auto p-4 flex flex-col items-start text-left"
              onClick={() => onSelectCategory(category.value)}
            >
              <div className="font-medium mb-1">{category.label}</div>
              <div className="text-sm text-muted-foreground">
                {category.description}
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExerciseCategoryFilters;
