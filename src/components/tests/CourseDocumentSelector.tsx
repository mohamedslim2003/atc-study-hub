
import React, { useState, useEffect } from 'react';
import { Course } from '@/types/course';
import { getCourses } from '@/services/courseService';
import { Card, CardContent } from '@/components/ui-custom/Card';
import { Button } from '@/components/ui-custom/Button';
import { FileText, Check } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface CourseDocumentSelectorProps {
  onDocumentSelected: (course: Course) => void;
}

const CourseDocumentSelector: React.FC<CourseDocumentSelectorProps> = ({ onDocumentSelected }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  
  // Fetch courses with documents
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const allCourses = await getCourses();
        // Filter courses that have file documents
        const coursesWithDocs = allCourses.filter(course => 
          course.fileData && course.fileName && course.fileType
        );
        setCourses(coursesWithDocs);
      } catch (error) {
        console.error("Failed to load courses:", error);
        toast.error("Failed to load courses with documents");
      }
    };
    
    fetchCourses();
  }, []);
  
  const handleCourseSelection = (courseId: string) => {
    setSelectedCourseId(courseId);
    const course = courses.find(c => c.id === courseId) || null;
    setSelectedCourse(course);
  };
  
  const handleSelectDocument = () => {
    if (selectedCourse) {
      onDocumentSelected(selectedCourse);
    }
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Select Course Document</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Choose a course document that contains questions and answers for your test.
      </p>
      
      {courses.length === 0 ? (
        <Card className="p-6 bg-muted/50 flex flex-col items-center justify-center space-y-2">
          <FileText className="h-12 w-12 text-muted-foreground/70" />
          <p className="text-center text-muted-foreground">
            No course documents found. Please upload documents to your courses first.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          <Select onValueChange={handleCourseSelection} value={selectedCourseId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.id} value={course.id}>
                  {course.title} ({course.fileName || 'No filename'})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedCourse && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{selectedCourse.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {selectedCourse.fileName || 'No filename'}
                    </p>
                  </div>
                  <Button 
                    onClick={handleSelectDocument}
                    leftIcon={<Check className="h-4 w-4" />}
                  >
                    Use This Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDocumentSelector;
