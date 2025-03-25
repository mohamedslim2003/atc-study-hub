
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';

const TestsPage: React.FC = () => {
  return (
    <div className="animate-enter">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
        <p className="text-muted-foreground mt-1">
          Assess your knowledge with mock exams
        </p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Available Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Tests will be added by the administrator soon.
            </p>
            <p className="text-muted-foreground mt-2">
              Check back later for updated exam materials.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestsPage;
