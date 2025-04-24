
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { FileText, Search, Filter, Trophy, Clock, BarChart, Calendar, Eye, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import CreateTestDialog from '@/components/tests/CreateTestDialog';
import { useAuth } from '@/hooks/useAuth';
import { Progress } from '@/components/ui/progress';
import { getTests, getUserTestSubmissions } from '@/services/testService';
import { Test, TestSubmission } from '@/types/test';
import TestView from '@/components/tests/TestView';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const TestsPage: React.FC = () => {
  const [showViewTestDialog, setShowViewTestDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    const fetchData = () => {
      setIsLoading(true);
      try {
        const allTests = getTests();
        setTests(allTests);
        
        if (user) {
          const userSubmissions = getUserTestSubmissions(user.id);
          setSubmissions(userSubmissions);
        }
      } catch (error) {
        console.error("Error fetching tests:", error);
        toast.error("Failed to load tests");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);

  const handleTestCreated = () => {
    // Refresh the tests list
    const allTests = getTests();
    setTests(allTests);
    toast.success("Test list updated");
  };

  // Function to handle test view
  const handleViewTest = (test: Test) => {
    setSelectedTest(test);
    setShowViewTestDialog(true);
  };
  
  const handleCreateTestClick = () => {
    console.log("Create test button clicked"); // Add debug logging
    setShowCreateDialog(true);
  };

  // Function to filter tests by search query
  const filteredTests = tests.filter(test => 
    test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    test.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const completedTests = submissions.length;
  const averageScore = submissions.length > 0
    ? Math.round(submissions.reduce((sum, sub) => sum + sub.score, 0) / submissions.length)
    : 0;
  const nextScheduledTest = tests.length > 0 ? "Today" : "No tests available";

  return (
    <div className="animate-enter">
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
                onClick={handleCreateTestClick}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Create Test
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Stats cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tests Completed</p>
                <h3 className="text-2xl font-bold mt-1">{completedTests}</h3>
              </div>
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <h3 className="text-2xl font-bold mt-1">{averageScore}%</h3>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Trophy className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Scheduled Test</p>
                <h3 className="text-2xl font-bold mt-1">{nextScheduledTest}</h3>
              </div>
              <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search tests..." 
                  className="pl-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="md:w-auto" leftIcon={<Filter className="h-4 w-4" />}>
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Tests Section */}
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
          ) : filteredTests.length === 0 ? (
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
                    onClick={() => setShowCreateDialog(true)}
                    className="mt-2"
                    leftIcon={<Plus className="h-4 w-4" />}
                  >
                    Create Test
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {filteredTests.map((test) => {
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
                        onClick={() => handleViewTest(test)}
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

      {/* Take Test Dialog */}
      <Dialog 
        open={showViewTestDialog} 
        onOpenChange={(open) => {
          if (!open) setSelectedTest(null);
          setShowViewTestDialog(open);
        }}
      >
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>
            {selectedTest?.title || "Test"}
          </DialogTitle>
          {selectedTest && (
            <TestView 
              test={selectedTest} 
              onComplete={() => {
                // Refresh submissions after test completion
                if (user) {
                  const userSubmissions = getUserTestSubmissions(user.id);
                  setSubmissions(userSubmissions);
                }
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Create Test Dialog */}
      <CreateTestDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
        onTestCreated={handleTestCreated}
      />
    </div>
  );
};

export default TestsPage;
