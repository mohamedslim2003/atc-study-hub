
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import TestCreationForm, { TestFormData } from './TestCreationForm';
import { toast } from 'sonner';

interface CreateTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateTestDialog: React.FC<CreateTestDialogProps> = ({ open, onOpenChange }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: TestFormData) => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, you would send this data to your backend
      console.log("Test creation data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Test created successfully");
      onOpenChange(false);
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
