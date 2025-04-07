
import React, { useState, useEffect } from 'react';
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
  const [course, setCourse] = useState<any>(null);
  
  useEffect(() => {
    if (courseId) {
      const foundCourse = getCourseById(courseId);
      setCourse(foundCourse);
      
      if (!foundCourse && !isSubmitting) {
        toast.error('Course not found');
        navigate('/dashboard/courses');
      }
    }
  }, [courseId, navigate, isSubmitting]);
  
  // Redirect non-admin users
  if (!isAdmin) {
    navigate('/dashboard/courses');
    return null;
  }

  const handleSubmit = (data: CourseFormData) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting course data:", data);
      
      const courseData: any = {
        title: data.title,
        description: data.description,
        content: data.content,
        category: data.category,
      };
      
      // Add file data if present
      if (data.fileData) {
        courseData.fileData = data.fileData;
        courseData.fileType = data.fileType;
        if (data.file) {
          courseData.fileName = data.file.name;
        }
      }
      
      if (courseId) {
        // Update existing course
        updateCourse(courseId, courseData);
        toast.success('Course updated successfully');
      } else {
        // Create new course
        addCourse(courseData);
        toast.success('Course created successfully');
      }
      navigate('/dashboard/courses');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save course');
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
