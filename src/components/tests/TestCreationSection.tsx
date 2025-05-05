
import React from 'react';
import QuickTestForm, { QuickTestFormData } from '@/components/tests/QuickTestForm';

interface TestCreationSectionProps {
  showQuickCreate: boolean;
  isSubmitting: boolean;
  onSubmit: (data: QuickTestFormData) => void;
  onCancel: () => void;
  isAdmin: boolean;
}

const TestCreationSection: React.FC<TestCreationSectionProps> = ({
  showQuickCreate,
  isSubmitting,
  onSubmit,
  onCancel,
  isAdmin
}) => {
  if (!showQuickCreate || !isAdmin) return null;
  
  return (
    <QuickTestForm
      onSubmit={onSubmit}
      onCancel={onCancel}
      isSubmitting={isSubmitting}
    />
  );
};

export default TestCreationSection;
