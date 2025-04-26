
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { FileText, Search, Filter, Trophy, Clock, BarChart, Calendar, Eye, Download, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Progress } from '@/components/ui/progress';
import { getTests, getUserTestSubmissions, createTest } from '@/services/testService';
import { Test, TestSubmission, Question, Option } from '@/types/test';
import TestView from '@/components/tests/TestView';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface QuickTestFormData {
  title: string;
  description: string;
  duration: number;
  category: 'fundamentals' | 'advanced' | 'airspace' | 'emergency';
  question: string;
  options: string[];
  correctOptionIndex: number;
}

const TestsPage: React.FC = () => {
  const [showViewTestDialog, setShowViewTestDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [showQuickCreate, setShowQuickCreate] = useState(false);
  const [tests, setTests] = useState<Test[]>([]);
  const [submissions, setSubmissions] = useState<TestSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAdmin, user } = useAuth();

  const form = useForm<QuickTestFormData>({
    defaultValues: {
      title: '',
      description: '',
      duration: 15,
      category: 'fundamentals',
      question: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0
    }
  });

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

  const handleQuickCreate = (data: QuickTestFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create a question from the form data
      const options: Option[] = data.options.map((text, index) => ({
        id: `q1o${index + 1}`,
        text
      }));

      const question: Question = {
        id: 'q1',
        text: data.question,
        options,
        correctOptionId: `q1o${data.correctOptionIndex + 1}`
      };

      // Create the test with our single question
      const newTest = createTest({
        title: data.title,
        description: data.description,
        duration: data.duration,
        category: data.category,
        questions: [question]
      });
      
      // Refresh the tests list
      setTests([...tests, newTest]);
      toast.success("Test created successfully!");
      setShowQuickCreate(false);
      form.reset();
    } catch (error) {
      console.error("Error creating test:", error);
      toast.error("Failed to create test");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle test view
  const handleViewTest = (test: Test) => {
    setSelectedTest(test);
    setShowViewTestDialog(true);
  };
  
  const handleCreateTestClick = () => {
    setShowQuickCreate(!showQuickCreate);
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

      {/* Quick Create Form - Only shown when Create Test is clicked */}
      {showQuickCreate && isAdmin && (
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quick Create Test</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowQuickCreate(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleQuickCreate)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Test Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter test title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            {...field} 
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter test description" 
                          className="min-h-16"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col md:flex-row gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="fundamentals" id="fundamentals" />
                            </FormControl>
                            <FormLabel htmlFor="fundamentals" className="font-normal cursor-pointer">
                              Fundamentals
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="advanced" id="advanced" />
                            </FormControl>
                            <FormLabel htmlFor="advanced" className="font-normal cursor-pointer">
                              Advanced
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="airspace" id="airspace" />
                            </FormControl>
                            <FormLabel htmlFor="airspace" className="font-normal cursor-pointer">
                              Airspace
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="emergency" id="emergency" />
                            </FormControl>
                            <FormLabel htmlFor="emergency" className="font-normal cursor-pointer">
                              Emergency
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="border rounded-md p-4 space-y-4">
                  <h3 className="text-lg font-medium">Question</h3>
                  
                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Question Text</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your question here..." 
                            className="min-h-16"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Options</h4>
                    
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Checkbox 
                          id={`option-${index}`} 
                          checked={form.watch('correctOptionIndex') === index}
                          onCheckedChange={() => form.setValue('correctOptionIndex', index)}
                        />
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={form.watch('options')[index]}
                          onChange={(e) => {
                            const newOptions = [...form.watch('options')];
                            newOptions[index] = e.target.value;
                            form.setValue('options', newOptions);
                          }}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit"
                    isLoading={isSubmitting}
                  >
                    Create Test
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

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
                    onClick={() => setShowQuickCreate(true)}
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
    </div>
  );
};

export default TestsPage;
