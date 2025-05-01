
import React from 'react';
import CategoryWidget from '@/components/courses/CategoryWidget';

interface TestCategorySelectionProps {
  selectedCategory: 'aerodrome' | 'approach' | 'ccr' | null;
  onSelectCategory: (category: 'aerodrome' | 'approach' | 'ccr') => void;
}

const TestCategorySelection: React.FC<TestCategorySelectionProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Select Test Category</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <CategoryWidget 
          category="aerodrome" 
          isActive={selectedCategory === 'aerodrome'} 
          onClick={() => onSelectCategory('aerodrome')} 
        />
        <CategoryWidget 
          category="approach" 
          isActive={selectedCategory === 'approach'} 
          onClick={() => onSelectCategory('approach')} 
        />
        <CategoryWidget 
          category="ccr" 
          isActive={selectedCategory === 'ccr'} 
          onClick={() => onSelectCategory('ccr')} 
        />
      </div>
    </div>
  );
};

export default TestCategorySelection;
