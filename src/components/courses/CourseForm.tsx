
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui-custom/Button';
import { Course } from '@/types/course';
import { Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner';

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
  file?: File;
}

const CourseForm: React.FC<CourseFormProps> = ({ 
  course, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}) => {
  const [file, setFile] = useState<File | null>(null);

  const form = useForm<CourseFormData>({
    defaultValues: {
      title: course?.title || '',
      description: course?.description || '',
      content: course?.content || '',
    },
  });

  // Reset form when course changes
  useEffect(() => {
    if (course) {
      form.reset({
        title: course.title || '',
        description: course.description || '',
        content: course.content || '',
      });
    }
  }, [course, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Read file content if it's a text file
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const content = event.target.result as string;
          console.log("File content loaded:", content.substring(0, 100) + "...");
          form.setValue('content', content);
        }
      };
      
      reader.onerror = () => {
        toast.error("Failed to read file");
      };
      
      if (selectedFile.type === 'text/plain' || 
          selectedFile.type === 'application/msword' || 
          selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        reader.readAsText(selectedFile);
      } else {
        toast.error("Please upload a text or Word document");
        setFile(null);
      }
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
        
        <div className="border rounded-md p-4 space-y-2">
          <p className="text-sm font-medium">Content</p>
          <div className="flex items-center gap-4">
            <Input 
              id="file" 
              type="file" 
              onChange={handleFileChange}
              accept=".txt,.doc,.docx"
              className="max-w-64"
            />
            <p className="text-sm text-muted-foreground">
              {file ? `File selected: ${file.name}` : 'Upload from your PC or enter content below'}
            </p>
          </div>
          
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
