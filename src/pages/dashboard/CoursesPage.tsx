
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui-custom/Button';
import { BookOpen, Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

const CoursesPage: React.FC = () => {
  return (
    <div className="animate-enter">
      <header className="mb-8">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
            <p className="text-muted-foreground mt-1">
              Browse available courses to enhance your ATC knowledge
            </p>
          </div>
        </div>
      </header>

      {/* Search and filters */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search courses..." className="pl-9" />
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
          <CardTitle>Available Courses</CardTitle>
        </CardHeader>
        <CardContent className="py-10">
          <div className="text-center">
            <div className="inline-flex h-20 w-20 rounded-full bg-primary/10 items-center justify-center mb-4">
              <BookOpen className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Courses Available Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Courses will be added by the administrator soon. Check back later for updated content.
            </p>
            <div className="flex flex-col items-center gap-2">
              <Button variant="outline" className="px-8">Refresh</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden">
            <div className="h-40 bg-primary/20 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-primary/60" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium mb-1">ATC Fundamentals</h3>
              <p className="text-sm text-muted-foreground">
                Learn the fundamental concepts and procedures of air traffic control.
              </p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="h-40 bg-primary/20 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-primary/60" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium mb-1">Airspace Classifications</h3>
              <p className="text-sm text-muted-foreground">
                Understand different airspace classes and their regulations.
              </p>
            </CardContent>
          </Card>
          
          <Card className="overflow-hidden">
            <div className="h-40 bg-primary/20 flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-primary/60" />
            </div>
            <CardContent className="p-4">
              <h3 className="font-medium mb-1">Communication Protocols</h3>
              <p className="text-sm text-muted-foreground">
                Master standard ATC communication protocols and phraseology.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
