
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Test } from '@/types/test';

// Import our components
import TestStats from '@/components/tests/TestStats';
import TestSearch from '@/components/tests/TestSearch';
import TestList from '@/components/tests/TestList';
import TestCategoryFilters from '@/components/tests/TestCategoryFilters';
import TestCreationSection from '@/components/tests/TestCreationSection';
import TestPageHeader from '@/components/tests/TestPageHeader';
import TestViewDialog from '@/components/tests/TestViewDialog';
import { useTestManagement } from '@/hooks/useTestManagement';

const TestsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isAdmin } = useAuth();
  
  const {
    tests,
    submissions,
    selectedTest,
    showViewTestDialog,
    showQuickCreate,
    selectedCategory,
    isLoading,
    isSubmitting,
    completedTests,
    averageScore,
    nextScheduledTest,
    handleQuickCreate,
    handleViewTest,
    handleCreateTestClick,
    handleCategorySelect,
    handleTestComplete,
    setShowViewTestDialog,
    setSelectedTest,
    setShowQuickCreate
  } = useTestManagement();

  // Function to filter tests by search query
  const filteredTests = tests.filter(test => 
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-enter">
      <TestPageHeader 
        onCreateTestClick={handleCreateTestClick}
        isAdmin={isAdmin}
      />

      <TestStats 
        completedTests={completedTests}
        averageScore={averageScore}
        nextScheduledTest={nextScheduledTest}
      />

      <TestCategoryFilters
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        isAdmin={isAdmin}
      />

      {isAdmin && (
        <TestSearch 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      )}

      <TestCreationSection
        showQuickCreate={showQuickCreate}
        isSubmitting={isSubmitting}
        onSubmit={handleQuickCreate}
        onCancel={() => setShowQuickCreate(false)}
        isAdmin={isAdmin}
      />

      {isAdmin && (
        <TestList
          tests={filteredTests}
          submissions={submissions}
          isLoading={isLoading}
          onViewTest={handleViewTest}
          isAdmin={isAdmin}
          onCreateTest={() => setShowQuickCreate(true)}
        />
      )}

      <TestViewDialog
        showDialog={showViewTestDialog}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTest(null);
          }
          setShowViewTestDialog(open);
        }}
        selectedTest={selectedTest}
        onComplete={handleTestComplete}
      />
    </div>
  );
};

export default TestsPage;
