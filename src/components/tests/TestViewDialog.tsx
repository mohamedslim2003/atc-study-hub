
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import TestView from '@/components/tests/TestView';
import { Test } from '@/types/test';

interface TestViewDialogProps {
  showDialog: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTest: Test | null;
  onComplete: () => void;
}

const TestViewDialog: React.FC<TestViewDialogProps> = ({
  showDialog,
  onOpenChange,
  selectedTest,
  onComplete
}) => {
  return (
    <Dialog 
      open={showDialog} 
      onOpenChange={(open) => {
        if (!open) {
          console.log("Closing test dialog");
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogTitle>
          {selectedTest?.title || "Test"}
        </DialogTitle>
        {selectedTest && (
          <TestView 
            test={selectedTest} 
            onComplete={onComplete} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TestViewDialog;
