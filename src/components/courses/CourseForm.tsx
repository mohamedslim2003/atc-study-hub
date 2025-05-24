
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui-custom/Button';
import { Course } from '@/types/course';
import { Loader2, Upload, Eye, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui-custom/Card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export interface CourseFormData {
  title: string;
  description: string;
  content: string;
  category: 'aerodrome' | 'approach' | 'ccr' | 'uncategorized';
  file?: File;
}

const CourseForm: React.FC<CourseFormProps> = ({ 
  course, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string | null>(null);

  const form = useForm<CourseFormData>({
    defaultValues: {
      title: course?.title || '',
      description: course?.description || '',
      content: course?.content || '',
      category: course?.category || 'uncategorized',
    },
  });

  // Reset form when course changes
  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title || '',
        description: course.description || '',
        content: course.content || '',
        category: course.category || 'uncategorized',
      });
      
      // Set file type if course has a file
      if (course.fileType) {
        setFileType(course.fileType);
      }
    }
  }, [course, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (50MB limit)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (selectedFile.size > maxSize) {
        toast.error("File size must be less than 50MB");
        return;
      }
      
      setFile(selectedFile);
      setFileType(selectedFile.type);
      
      // For text files, read content and populate the textarea
      if (selectedFile.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const content = event.target.result.toString();
            form.setValue('content', content);
          }
        };
        reader.readAsText(selectedFile);
      } else {
        toast.success(`${selectedFile.name} selected for upload`);
      }
    }
  };

  const handlePreview = () => {
    if (file) {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
    } else if (course?.fileData) {
      // For existing course files, open the Supabase URL
      window.open(course.fileData, '_blank');
    } else {
      toast.error("No file to preview");
    }
  };

  const handleDownload = () => {
    if (course?.fileData) {
      // Create a temporary link to download from Supabase
      const link = document.createElement('a');
      link.href = course.fileData;
      link.download = course.fileName || 'document';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Download started");
    } else {
      toast.error("No file available for download");
    }
  };

  const handleSubmit = (data: CourseFormData) => {
    console.log("Form submission data:", data);
    if (file) {
      data.file = file;
    }
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter course title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter course description" 
                  className="min-h-24"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Category</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col md:flex-row gap-4"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="aerodrome" id="aerodrome" />
                    </FormControl>
                    <FormLabel htmlFor="aerodrome" className="font-normal cursor-pointer">
                      Aerodrome
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="approach" id="approach" />
                    </FormControl>
                    <FormLabel htmlFor="approach" className="font-normal cursor-pointer">
                      Approach
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="ccr" id="ccr" />
                    </FormControl>
                    <FormLabel htmlFor="ccr" className="font-normal cursor-pointer">
                      CCR
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="border rounded-md p-4 space-y-2">
          <p className="text-sm font-medium">Content</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex flex-col gap-2">
              <Input 
                id="file" 
                type="file" 
                onChange={handleFileChange}
                accept=".txt,.docx,.doc,.pdf"
                className="max-w-64"
              />
              <p className="text-sm text-muted-foreground">
                {file ? `New file selected: ${file.name}` : 
                 course?.fileName ? `Current file: ${course.fileName}` :
                 'Upload a .txt, .docx, .doc or .pdf file (max 50MB)'}
              </p>
            </div>
            
            {(file || course?.fileData) && (
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handlePreview}
                  leftIcon={<Eye className="h-4 w-4" />}
                >
                  Preview
                </Button>
                
                {course?.fileData && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleDownload}
                    leftIcon={<Download className="h-4 w-4" />}
                  >
                    Download
                  </Button>
                )}
              </div>
            )}
          </div>
          
          {/* Show content text area only for plain text or when no file */}
          {(!fileType || fileType === 'text/plain') && (
            <div className="mt-4">
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter course content or upload file" 
                        className="min-h-48"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
          
          {(fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            fileType === 'application/msword' ||
            fileType === 'application/pdf') && (
            <Card className="p-4 mt-4 bg-muted/50">
              <p className="text-center text-muted-foreground">
                {fileType === 'application/pdf' 
                  ? 'PDF file will be stored in Supabase Storage and available for download.'
                  : 'Word document will be stored in Supabase Storage and available for download.'}
              </p>
            </Card>
          )}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button 
            type="submit"
            isLoading={isSubmitting}
          >
            {course ? 'Update Course' : 'Create Course'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CourseForm;
