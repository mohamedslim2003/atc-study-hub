
import React from 'react';
import TestCategorySelection from '@/components/tests/TestCategorySelection';
import { CategoryType } from '@/data/questions';

interface TestCategoryFiltersProps {
  selectedCategory: CategoryType | null;
  onSelectCategory: (category: CategoryType) => void;
  isAdmin: boolean;
}

const TestCategoryFilters: React.FC<TestCategoryFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  isAdmin
}) => {
  if (isAdmin) return null;
  
  return (
    <TestCategorySelection
      selectedCategory={selectedCategory}
      onSelectCategory={onSelectCategory}
    />
  );
};

export default TestCategoryFilters;
