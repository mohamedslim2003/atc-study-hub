
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { FileText, Search, Filter, Trophy, Clock, BarChart, Calendar } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';

const TestsPage: React.FC = () => {
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
        </div>
      </header>

      {/* Stats cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tests Completed</p>
                <h3 className="text-2xl font-bold mt-1">0</h3>
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
                <h3 className="text-2xl font-bold mt-1">0%</h3>
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
                <h3 className="text-2xl font-bold mt-1">None</h3>
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
                <Input placeholder="Search tests..." className="pl-9" />
              </div>
              <Button variant="outline" className="md:w-auto" leftIcon={<Filter className="h-4 w-4" />}>
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Empty state */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Available Tests</CardTitle>
        </CardHeader>
        <CardContent className="py-10">
          <div className="text-center">
            <div className="inline-flex h-20 w-20 rounded-full bg-primary/10 items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Tests Available Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Tests will be added by the administrator soon. Check back later for updated exam materials.
            </p>
            <div className="flex flex-col items-center gap-2">
              <Button variant="outline" className="px-8">Refresh</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-lg flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-primary" />
                ATC Fundamentals Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground mb-4">
                A comprehensive test covering basic ATC concepts, regulations, and standard procedures.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                  <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">60 min</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                  <FileText className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">50 questions</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                  <BarChart className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">Beginner</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-lg flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-primary" />
                Airspace Classification Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground mb-4">
                Test your knowledge of airspace classifications, restrictions, and special use airspace.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                  <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">45 min</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                  <FileText className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">30 questions</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                  <BarChart className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">Intermediate</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TestsPage;
