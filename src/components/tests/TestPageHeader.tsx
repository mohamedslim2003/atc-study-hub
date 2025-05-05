
import React from 'react';
import { FileText, Plus } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';

interface TestPageHeaderProps {
  onCreateTestClick: () => void;
  isAdmin: boolean;
}

const TestPageHeader: React.FC<TestPageHeaderProps> = ({ onCreateTestClick, isAdmin }) => {
  return (
    <header className="mb-8">
      <div className="flex items-center">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
          <FileText className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
          <p className="text-muted-foreground mt-1">
            Assess your knowledge with mock exams
          </p>
        </div>
        {isAdmin && (
          <div className="ml-auto">
            <Button 
              onClick={onCreateTestClick}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Create Test
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TestPageHeader;
