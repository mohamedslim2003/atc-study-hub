import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui-custom/Button';
import { Card, CardContent } from '@/components/ui-custom/Card';
import { ArrowLeft, BookOpen, Clock, Download, Eye, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { getCourseById } from '@/services/courseService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import DocumentPreview from '@/components/courses/DocumentPreview';

const CourseViewPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  
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
      try {
        // Create a download link for the document
        const link = document.createElement('a');
        
        // Set up the download based on file type
        link.href = course.fileData;
        
        // Set the filename with appropriate extension
        let fileExtension = 'txt';
        if (course.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
          fileExtension = 'docx';
        } else if (course.fileType === 'application/msword') {
          fileExtension = 'doc';
        } else if (course.fileType === 'application/pdf') {
          fileExtension = 'pdf';
        }
        
        link.download = course.fileName || `${course.title.replace(/\s+/g, '-').toLowerCase()}.${fileExtension}`;
        
        // Trigger the download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Download started successfully');
      } catch (error) {
        console.error('Download error:', error);
        toast.error('Failed to download file. Please try again.');
      }
    } else {
      toast.error('No document available for download');
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  // Helper function to get appropriate icon and label for different file types
  const getFileTypeInfo = () => {
    if (course.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return { icon: <FileText className="h-12 w-12 text-primary mx-auto mb-3" />, label: 'Word Document (.docx)' };
    } else if (course.fileType === 'application/msword') {
      return { icon: <FileText className="h-12 w-12 text-primary mx-auto mb-3" />, label: 'Word Document (.doc)' };
    } else if (course.fileType === 'application/pdf') {
      return { icon: <FileText className="h-12 w-12 text-primary mx-auto mb-3" />, label: 'PDF Document' };
    }
    return { icon: <BookOpen className="h-12 w-12 text-primary mx-auto mb-3" />, label: 'Document' };
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
          
          {(course.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            course.fileType === 'application/msword' ||
            course.fileType === 'application/pdf') ? (
            <div>
              <div className="bg-muted/30 rounded-md p-6 flex flex-col items-center justify-center mb-6">
                <div className="mb-4 text-center">
                  {getFileTypeInfo().icon}
                  <h3 className="text-lg font-medium">{course.fileName || 'Document'}</h3>
                  <p className="text-sm text-muted-foreground">{getFileTypeInfo().label}</p>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={togglePreview}
                    leftIcon={<Eye className="h-4 w-4" />}
                  >
                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                  </Button>
                  
                  <Button
                    onClick={handleDownloadDocument}
                    leftIcon={<Download className="h-4 w-4" />}
                  >
                    Download
                  </Button>
                </div>
              </div>
              
              {showPreview && (
                <div className="mt-6 bg-white rounded-md shadow">
                  <DocumentPreview 
                    fileData={course.fileData} 
                    fileType={course.fileType}
                    fileName={course.fileName}
                  />
                </div>
              )}
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
