
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import TestCreationForm, { TestFormData } from './TestCreationForm';
import { toast } from 'sonner';
import { createTest } from '@/services/testService';

interface CreateTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTestCreated?: () => void;
}

const CreateTestDialog: React.FC<CreateTestDialogProps> = ({ 
  open, 
  onOpenChange,
  onTestCreated 
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: TestFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create the test in our service
      const newTest = createTest(data);
      
      toast.success("Test created successfully");
      onOpenChange(false);
      
      // Call the callback if provided
      if (onTestCreated) {
        onTestCreated();
      }
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error("Failed to create test. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  console.log("CreateTestDialog open state:", open); // Add debug logging

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogTitle>Create New Test</DialogTitle>
        <TestCreationForm 
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTestDialog;
