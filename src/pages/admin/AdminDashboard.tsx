
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui-custom/Button';
import { useAuth } from '@/hooks/useAuth';
import { getUsersCount } from '@/utils/userUtils';
import { Users, BookOpen, FileText, ClipboardList, BarChart, Award, Settings } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    // Get the count of registered users
    setUsersCount(getUsersCount());
  }, []);

  return (
    <div className="animate-enter">
      <header className="mb-8">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
            <BarChart className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your ATC training platform
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
                <p className="text-sm font-medium text-white/80">Total Students</p>
                <h3 className="text-3xl font-bold mt-1">{usersCount}</h3>
              </div>
              <div className="h-12 w-12 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-3 text-sm text-white/70">
              {usersCount === 0 ? 'No students registered yet' : `${usersCount} ${usersCount === 1 ? 'student' : 'students'} registered`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Courses</p>
                <h3 className="text-3xl font-bold mt-1">0</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Exercises</p>
                <h3 className="text-3xl font-bold mt-1">0</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tests</p>
                <h3 className="text-3xl font-bold mt-1">0</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {usersCount > 0 ? (
                <div className="flex items-center p-3 bg-secondary/50 rounded-lg">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New student registered</p>
                    <p className="text-xs text-muted-foreground">There are now {usersCount} students in the system</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No recent activities</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline" leftIcon={<BookOpen className="h-4 w-4" />}>
                Add New Course
              </Button>
              <Button className="w-full justify-start" variant="outline" leftIcon={<ClipboardList className="h-4 w-4" />}>
                Create Exercise
              </Button>
              <Button className="w-full justify-start" variant="outline" leftIcon={<FileText className="h-4 w-4" />}>
                Create Test
              </Button>
              <Button className="w-full justify-start" variant="outline" leftIcon={<Users className="h-4 w-4" />}>
                Manage Students
              </Button>
              <Button className="w-full justify-start" variant="outline" leftIcon={<Settings className="h-4 w-4" />}>
                System Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Platform Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border rounded-lg p-4 text-center">
              <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                <Award className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Administrator</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {user?.firstName} {user?.lastName}
              </p>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Students</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {usersCount} registered
              </p>
            </div>
            
            <div className="border rounded-lg p-4 text-center">
              <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Content</h3>
              <p className="text-sm text-muted-foreground mt-1">
                0 courses, 0 exercises
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
