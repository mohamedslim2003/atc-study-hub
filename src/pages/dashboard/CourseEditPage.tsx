
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import CourseForm, { CourseFormData } from '@/components/courses/CourseForm';
import { getCourseById, updateCourse, addCourse } from '@/services/courseService';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const CourseEditPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const course = courseId ? getCourseById(courseId) : undefined;
  
  // Redirect non-admin users
  if (!isAdmin) {
    navigate('/dashboard/courses');
    return null;
  }

  const handleSubmit = (data: CourseFormData) => {
    setIsSubmitting(true);
    
    try {
      if (course) {
        // Update existing course
        updateCourse(course.id, {
          title: data.title,
          description: data.description,
          content: data.content,
        });
        toast.success('Course updated successfully');
      } else {
        // Create new course
        addCourse({
          title: data.title,
          description: data.description,
          content: data.content,
        });
        toast.success('Course created successfully');
      }
      navigate('/dashboard/courses');
    } catch (error) {
      toast.error('Failed to save course');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-3xl font-bold tracking-tight">
          {course ? 'Edit Course' : 'Create New Course'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {course
            ? 'Update course details and content'
            : 'Add a new course to the platform'}
        </p>
      </header>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>{course ? 'Course Details' : 'New Course'}</CardTitle>
        </CardHeader>
        <CardContent>
          <CourseForm
            course={course}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/dashboard/courses')}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseEditPage;
