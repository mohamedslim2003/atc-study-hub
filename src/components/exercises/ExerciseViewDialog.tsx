
import React from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Exercise } from '@/types/exercise';
import ExerciseView from './ExerciseView';

interface ExerciseViewDialogProps {
  showDialog: boolean;
  onOpenChange: (open: boolean) => void;
  selectedExercise: Exercise | null;
  onComplete?: () => void;
}

const ExerciseViewDialog: React.FC<ExerciseViewDialogProps> = ({
  showDialog,
  onOpenChange,
  selectedExercise,
  onComplete
}) => {
  if (!selectedExercise) return null;

  return (
    <Dialog open={showDialog} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="sr-only">
          {selectedExercise.title}
        </DialogTitle>
        <ExerciseView
          exercise={selectedExercise}
          onComplete={onComplete}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ExerciseViewDialog;
