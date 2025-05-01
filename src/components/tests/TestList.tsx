
import React from 'react';
import { FileText, BarChart, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-custom/Card';
import { Badge } from '@/components/ui/badge';
import { Test, TestSubmission } from '@/types/test';

interface TestListProps {
  tests: Test[];
  submissions: TestSubmission[];
  isLoading: boolean;
  onViewTest: (test: Test) => void;
  isAdmin: boolean;
  onCreateTest: () => void;
}

const TestList: React.FC<TestListProps> = ({
  tests,
  submissions,
  isLoading,
  onViewTest,
  isAdmin,
  onCreateTest
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Available Tests</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
              <span>Loading tests...</span>
            </div>
          </div>
        ) : tests.length === 0 ? (
          <div className="p-6 text-center">
            <div className="flex flex-col items-center space-y-2">
              <FileText className="h-10 w-10 text-muted-foreground/70" />
              <h3 className="font-medium">No tests available</h3>
              <p className="text-sm text-muted-foreground">
                {isAdmin ? 
                  "Create a new test to get started." : 
                  "Check back later for available tests."}
              </p>
              {isAdmin && (
                <Button 
                  onClick={onCreateTest}
                  className="mt-2"
                  leftIcon={<FileText className="h-4 w-4" />}
                >
                  Create Test
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="divide-y">
            {tests.map((test) => {
              const userSubmission = submissions.find(s => s.testId === test.id);
              const hasCompleted = !!userSubmission;
              
              return (
                <div key={test.id} className="p-6 hover:bg-muted/40 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-primary/10 rounded-md">
                        <FileText className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{test.title}</h3>
                          {hasCompleted && (
                            <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                              Completed ({Math.round(userSubmission.score)}%)
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 mb-2">
                          {test.description}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                            <Clock className="h-3 w-3 mr-1" /> {test.duration} minutes
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                            <FileText className="h-3 w-3 mr-1" /> {test.questions.length} questions
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                            <BarChart className="h-3 w-3 mr-1" /> {test.category}
                          </span>
                          {test.courseName && (
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                              Course: {test.courseName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button 
                      leftIcon={<Eye className="h-4 w-4" />}
                      onClick={() => onViewTest(test)}
                      className="md:w-auto"
                    >
                      {hasCompleted ? "Review Test" : "Start Test"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestList;
