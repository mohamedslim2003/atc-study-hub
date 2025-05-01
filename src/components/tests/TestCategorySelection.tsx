
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
  // Handler function to ensure click events are properly captured
  const handleCategoryClick = (category: 'aerodrome' | 'approach' | 'ccr') => {
    console.log(`Category clicked: ${category}`);
    onSelectCategory(category);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">Select Test Category</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <CategoryWidget 
          category="aerodrome" 
          isActive={selectedCategory === 'aerodrome'} 
          onClick={() => handleCategoryClick('aerodrome')} 
        />
        <CategoryWidget 
          category="approach" 
          isActive={selectedCategory === 'approach'} 
          onClick={() => handleCategoryClick('approach')} 
        />
        <CategoryWidget 
          category="ccr" 
          isActive={selectedCategory === 'ccr'} 
          onClick={() => handleCategoryClick('ccr')} 
        />
      </div>
    </div>
  );
};

export default TestCategorySelection;
