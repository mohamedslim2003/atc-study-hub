
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui-custom/Button';
import { ClipboardList, Search, Filter, Clock, BarChart } from 'lucide-react';
import { Input } from '@/components/ui/input';

const ExercisesPage: React.FC = () => {
  return (
    <div className="animate-enter">
      <header className="mb-8">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
            <ClipboardList className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Exercises</h1>
            <p className="text-muted-foreground mt-1">
              Practice your skills with interactive exercises
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
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <h3 className="text-2xl font-bold mt-1">0</h3>
              </div>
              <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <h3 className="text-2xl font-bold mt-1">0</h3>
              </div>
              <div className="h-10 w-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <h3 className="text-2xl font-bold mt-1">0%</h3>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart className="h-5 w-5 text-blue-600" />
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
                <Input placeholder="Search exercises..." className="pl-9" />
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
          <CardTitle>Available Exercises</CardTitle>
        </CardHeader>
        <CardContent className="py-10">
          <div className="text-center">
            <div className="inline-flex h-20 w-20 rounded-full bg-primary/10 items-center justify-center mb-4">
              <ClipboardList className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Exercises Available Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Exercises will be added by the administrator soon. Check back later for updated practice materials.
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
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-5">
              <div className="flex items-start">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Radar Identification Practice</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Practice identifying aircraft on radar screens and learn proper tracking procedures.
                  </p>
                  <div className="flex items-center mt-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>Estimated time: 30 minutes</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground ml-4">
                      <BarChart className="h-3.5 w-3.5 mr-1" />
                      <span>Difficulty: Intermediate</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-5">
              <div className="flex items-start">
                <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Communication Scenario Training</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Practice standard phraseology and communication protocols in various ATC scenarios.
                  </p>
                  <div className="flex items-center mt-3">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 mr-1" />
                      <span>Estimated time: 45 minutes</span>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground ml-4">
                      <BarChart className="h-3.5 w-3.5 mr-1" />
                      <span>Difficulty: Beginner</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExercisesPage;
