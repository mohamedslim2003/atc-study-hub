
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui-custom/Button';
import { Card, CardContent } from '@/components/ui-custom/Card';
import { ArrowLeft, BookOpen, Clock, Download, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { getCourseById } from '@/services/courseService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const CourseViewPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (courseId) {
      const foundCourse = getCourseById(courseId);
      setCourse(foundCourse);
      setLoading(false);
      
      if (!foundCourse) {
        toast.error('Course not found');
      }
    }
  }, [courseId]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p>Loading course...</p>
      </div>
    );
  }
  
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

  const handleDownloadDocument = () => {
    if (course.fileData && course.fileType) {
      // Create a download link for the document
      const link = document.createElement('a');
      
      // Set up the download based on file type
      if (course.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // For DOCX files, use the base64 data
        link.href = course.fileData;
      } else {
        // For text files, create a blob
        const blob = new Blob([course.fileData], { type: 'text/plain' });
        link.href = URL.createObjectURL(blob);
      }
      
      // Set the filename
      link.download = course.fileName || `${course.title.replace(/\s+/g, '-').toLowerCase()}.${course.fileType.includes('docx') ? 'docx' : 'txt'}`;
      
      // Trigger the download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.error('No document available for download');
    }
  };

  const handlePreviewDocument = () => {
    if (course.fileData && course.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      // Open the document in a new tab
      window.open(course.fileData, '_blank');
    } else {
      toast.error('No document available for preview');
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
          
          {course.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
            <div className="bg-muted/30 rounded-md p-6 flex flex-col items-center justify-center">
              <div className="mb-4 text-center">
                <BookOpen className="h-12 w-12 text-primary mx-auto mb-3" />
                <h3 className="text-lg font-medium">{course.fileName || 'Document'}</h3>
                <p className="text-sm text-muted-foreground">Word Document</p>
              </div>
              
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  variant="outline"
                  onClick={handlePreviewDocument}
                  leftIcon={<Eye className="h-4 w-4" />}
                >
                  Preview Document
                </Button>
                
                <Button
                  onClick={handleDownloadDocument}
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Download
                </Button>
              </div>
            </div>
          ) : (
            <div className="prose max-w-none">
              {course.content ? (
                course.content.split('\n').map((paragraph: string, index: number) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))
              ) : (
                <p className="text-muted-foreground">No content available for this course.</p>
              )}
            </div>
          )}
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
