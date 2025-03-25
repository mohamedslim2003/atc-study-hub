
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui-custom/Button';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, ClipboardList, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="animate-enter">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's everything you need to succeed in your ATC training.
        </p>
      </header>

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
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No recent activity yet. Start exploring courses and exercises!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHome;
