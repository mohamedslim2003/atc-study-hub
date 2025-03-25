
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';

const ExercisesPage: React.FC = () => {
  return (
    <div className="animate-enter">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Exercises</h1>
        <p className="text-muted-foreground mt-1">
          Practice your skills with interactive exercises
        </p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Available Exercises</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Exercises will be added by the administrator soon.
            </p>
            <p className="text-muted-foreground mt-2">
              Check back later for updated practice materials.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExercisesPage;
