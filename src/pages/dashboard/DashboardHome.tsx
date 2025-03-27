
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui-custom/Button';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, ClipboardList, FileText, Award, Clock, Activity, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUsersCount } from '@/utils/userUtils';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Get time of day for greeting
  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="animate-enter">
      <header className="mb-8">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {getTimeOfDay()}, {user?.firstName}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome to your ATC training dashboard
            </p>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="bg-gradient-to-br from-primary/80 to-primary text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/80">Your Progress</p>
                <h3 className="text-2xl font-bold mt-1">0%</h3>
              </div>
              <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="mt-4 h-1.5 bg-white/30 rounded-full">
              <div className="h-full w-0 bg-white rounded-full"></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Enrolled Courses</p>
                <h3 className="text-2xl font-bold mt-1">0</h3>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Exercises</p>
                <h3 className="text-2xl font-bold mt-1">0</h3>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Upcoming Tests</p>
                <h3 className="text-2xl font-bold mt-1">0</h3>
              </div>
              <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {/* Courses card */}
        <Card hover>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-primary" />
              Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Access comprehensive study materials and learning resources for ATC.
            </p>
            <Button 
              onClick={() => navigate('/dashboard/courses')}
              className="w-full"
            >
              Browse Courses
            </Button>
          </CardContent>
        </Card>

        {/* Exercises card */}
        <Card hover>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <ClipboardList className="mr-2 h-5 w-5 text-primary" />
              Exercises
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Practice with interactive exercises to reinforce your learning.
            </p>
            <Button 
              onClick={() => navigate('/dashboard/exercises')}
              className="w-full"
            >
              Start Practicing
            </Button>
          </CardContent>
        </Card>

        {/* Tests card */}
        <Card hover>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5 text-primary" />
              Tests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Assess your knowledge with mock exams and preparation tests.
            </p>
            <Button 
              onClick={() => navigate('/dashboard/tests')}
              className="w-full"
            >
              Take Tests
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity section */}
      <Card>
        <CardHeader className="border-b pb-4">
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            <div className="flex items-center py-4 px-6">
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Welcome to ATC Study Hub!</p>
                <p className="text-xs text-muted-foreground">Get started by exploring available courses.</p>
              </div>
              <div className="ml-auto">
                <span className="text-xs text-muted-foreground">
                  {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-muted/40 py-3 px-6 text-center">
            <p className="text-sm text-muted-foreground">
              Your learning activities will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
