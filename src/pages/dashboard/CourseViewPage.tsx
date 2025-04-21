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
import { Progress } from '@/components/ui/progress';

const CourseViewPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPreview, setShowPreview] = useState(false);
  
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  
  useEffect(() => {
    if (courseId) {
      try {
        const foundCourse = getCourseById(courseId);
        
        if (!foundCourse) {
          toast.error('Course not found');
          navigate('/dashboard/courses');
          return;
        }
        
        setCourse(foundCourse);
        
        if (foundCourse.fileDataPlaceholder) {
          // Alert the user about file data limitations
          toast.warning(
            'Due to browser storage limitations, this file is stored with limited preview capabilities.',
            { duration: 6000 }
          );
        } else if (foundCourse.fileStorageError) {
          // Alert the user about the file storage limitation
          toast.warning(
            'This file is large and only partially stored. You can still download the available content.',
            { duration: 6000 }
          );
        }
      } catch (error) {
        console.error("Error loading course:", error);
        toast.error('Failed to load course. Please try again.');
        navigate('/dashboard/courses');
      } finally {
        setLoading(false);
      }
    }
  }, [courseId, navigate]);
  
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
    // Check if file data exists
    if (!course.fileData) {
      toast.error('No document data available for download');
      return;
    }
    
    // Warn user about placeholder data
    if (course.fileDataPlaceholder) {
      toast.error('The complete file data is not available due to browser storage limitations.');
      return;
    }
    
    // Start the download process with progress
    setIsDownloading(true);
    setDownloadProgress(0);
    
    // Simulate download progress
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        const newProgress = prev + Math.floor(Math.random() * 10) + 5;
        
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Complete the download after progress reaches 100%
          setTimeout(() => {
            try {
              // Create blob from data URI
              const dataUriRegex = /^data:([a-z]+\/[a-z0-9-+.]+);base64,(.+)$/i;
              const matches = course.fileData.match(dataUriRegex);
              
              if (!matches || matches.length !== 3) {
                throw new Error('Invalid file data format');
              }
              
              const contentType = matches[1];
              const base64Data = matches[2];
              
              // Convert Base64 to binary in a more reliable way
              const byteCharacters = atob(base64Data);
              const byteArrays = [];
              
              for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                const slice = byteCharacters.slice(offset, offset + 512);
                
                const byteNumbers = new Array(slice.length);
                for (let i = 0; i < slice.length; i++) {
                  byteNumbers[i] = slice.charCodeAt(i);
                }
                
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
              }
              
              const blob = new Blob(byteArrays, { type: contentType });
              
              // Create a download link for the document
              const url = URL.createObjectURL(blob);
              
              // Set the filename with appropriate extension
              let fileExtension = 'txt';
              if (course.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                fileExtension = 'docx';
              } else if (course.fileType === 'application/msword') {
                fileExtension = 'doc';
              } else if (course.fileType === 'application/pdf') {
                fileExtension = 'pdf';
              }
              
              // Use the provided fileName if available, otherwise create a generic one
              const downloadName = course.fileName && course.fileName.trim() !== '' 
                ? (course.fileName.includes('.') ? course.fileName : `${course.fileName}.${fileExtension}`)
                : `${course.title.replace(/\s+/g, '-').toLowerCase()}.${fileExtension}`;
              
              const link = document.createElement('a');
              link.href = url;
              link.download = downloadName;
              
              // Trigger the download
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              // Cleanup
              URL.revokeObjectURL(url);
              
              toast.success('Download completed successfully');
            } catch (error) {
              console.error('Download error:', error);
              toast.error('Failed to download file. Please try again.');
            }
            
            // Reset download state
            setIsDownloading(false);
          }, 500);
          
          return 100;
        }
        
        return newProgress;
      });
    }, 200);
  };

  const togglePreview = () => {
    // Don't allow preview if we only have a placeholder
    if (course.fileDataPlaceholder) {
      toast.warning(
        'Preview is not available for this file due to browser storage limitations.',
        { duration: 5000 }
      );
      return;
    }
    
    // Allow preview attempt even with storage error
    if (course.fileStorageError) {
      toast.warning(
        'This file is large and only partially stored. Preview may be incomplete.',
        { duration: 5000 }
      );
    }
    
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
                  {course.fileDataPlaceholder && (
                    <p className="text-sm text-amber-500 mt-2">
                      This file exceeds browser storage limits. Download is not available.
                    </p>
                  )}
                  {!course.fileDataPlaceholder && course.fileStorageError && (
                    <p className="text-sm text-amber-500 mt-2">
                      This file exceeds browser storage limits. A partial download is still available.
                    </p>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center">
                  {!course.fileDataPlaceholder && (
                    <>
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
                        disabled={isDownloading}
                      >
                        {isDownloading ? 'Downloading...' : 'Download'}
                      </Button>
                    </>
                  )}
                  
                  {course.fileDataPlaceholder && (
                    <div className="text-center px-4 py-2 text-muted-foreground bg-muted rounded">
                      <p>This file is too large to store in browser storage.</p>
                      <p className="text-sm mt-1">Try uploading a smaller file or use a server-based solution.</p>
                    </div>
                  )}
                </div>
                
                {isDownloading && (
                  <div className="mt-4 w-full max-w-md">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Downloading...</span>
                      <span>{downloadProgress}%</span>
                    </div>
                    <Progress value={downloadProgress} className="h-2" />
                  </div>
                )}
              </div>
              
              {showPreview && !course.fileDataPlaceholder && (
                <div className="mt-6 bg-white rounded-md shadow">
                  <DocumentPreview 
                    fileData={course.fileData} 
                    fileType={course.fileType}
                    fileName={course.fileName}
                    hasStorageError={course.fileStorageError}
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
