
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';

const CoursesPage: React.FC = () => {
  return (
    <div className="animate-enter">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
        <p className="text-muted-foreground mt-1">
          Browse available courses to enhance your ATC knowledge
        </p>
      </header>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Available Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Courses will be added by the administrator soon.
            </p>
            <p className="text-muted-foreground mt-2">
              Check back later for updated content.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursesPage;
