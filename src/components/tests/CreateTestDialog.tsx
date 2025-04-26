
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
      // Check if we have file data
      if (data.fileData) {
        const fileType = data.fileType || 'unknown';
        const fileExt = data.fileName?.split('.').pop()?.toLowerCase() || '';
        
        console.log(`Processing ${fileExt} file...`);
        
        // In a real implementation, we would send the file to the server
        // for processing and extracting questions
      }
      
      // Create the test in our service
      const newTest = createTest(data);
      
      // Show a more detailed success message
      if (data.fileData) {
        const fileExt = data.fileName?.split('.').pop()?.toLowerCase();
        toast.success(`Test created successfully from ${fileExt} file`);
      } else {
        toast.success("Test created successfully");
      }
      
      // Make sure to close the dialog after test creation
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

  // Force the dialog to be rendered with the correct open state
  React.useEffect(() => {
    console.log("CreateTestDialog - open state updated:", open);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
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
