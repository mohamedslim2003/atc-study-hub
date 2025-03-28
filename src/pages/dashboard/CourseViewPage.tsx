
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui-custom/Button';
import { Card, CardContent } from '@/components/ui-custom/Card';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { getCourseById } from '@/services/courseService';
import { useAuth } from '@/hooks/useAuth';

const CourseViewPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  
  const course = courseId ? getCourseById(courseId) : undefined;
  
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <h2 className="text-xl font-semibold mb-4">Course not found</h2>
        <Button onClick={() => navigate('/dashboard/courses')}>
          Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-enter">
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          className="mr-2"
          onClick={() => navigate('/dashboard/courses')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
      </div>

      <header className="mb-6">
        <div className="flex items-center mb-2">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>Added {formatDistanceToNow(new Date(course.createdAt), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </header>

      <Card className="mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-muted-foreground mb-6">{course.description}</p>
          
          <Separator className="my-6" />
          
          <h2 className="text-xl font-semibold mb-4">Course Content</h2>
          <div className="prose max-w-none">
            {course.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>

      {isAdmin && (
        <div className="flex justify-end gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/dashboard/courses/edit/${course.id}`)}
          >
            Edit Course
          </Button>
        </div>
      )}
    </div>
  );
};

export default CourseViewPage;
