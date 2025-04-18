
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui-custom/Button';
import { Course } from '@/types/course';
import { Loader2, Upload, Eye } from 'lucide-react';
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
  fileData?: string;
  fileType?: string;
}

const CourseForm: React.FC<CourseFormProps> = ({ 
  course, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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
      
      // If there's file data in the course, set up preview
      if (course.fileData && course.fileType) {
        setFileType(course.fileType);
        
        if (
          course.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
          course.fileType === 'application/msword' ||
          course.fileType === 'application/pdf'
        ) {
          setPreviewUrl(null); // Can't preview directly, but we know it exists
        } else {
          // For other file types that can be previewed
          setPreviewUrl(course.fileData);
        }
      }
    }
  }, [course, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFileType(selectedFile.type);
      
      // Read file content
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          if (
            selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            selectedFile.type === 'application/msword' ||
            selectedFile.type === 'application/pdf'
          ) {
            // For docx, doc, pdf we'll store the raw data but can't preview directly
            const base64Data = event.target.result.toString();
            form.setValue('fileData', base64Data);
            form.setValue('fileType', selectedFile.type);
            setPreviewUrl(null); // Can't preview directly
          } else if (selectedFile.type === 'text/plain') {
            // For text files, we can display the content
            const content = event.target.result.toString();
            form.setValue('content', content);
            form.setValue('fileData', content);
            form.setValue('fileType', selectedFile.type);
            setPreviewUrl(null);
          } else {
            toast.error("Unsupported file type");
            setFile(null);
            setFileType(null);
          }
        }
      };
      
      reader.onerror = () => {
        toast.error("Failed to read file");
      };
      
      if (
        selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        selectedFile.type === 'application/msword' ||
        selectedFile.type === 'application/pdf'
      ) {
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type === 'text/plain') {
        reader.readAsText(selectedFile);
      } else {
        toast.error("Please upload a text, Word document, or PDF file");
        setFile(null);
        setFileType(null);
      }
    }
  };

  const handlePreview = () => {
    if (file) {
      if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/msword' ||
        file.type === 'application/pdf'
      ) {
        // Create a temporary link to open the file
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
      }
    } else {
      toast.error("No valid file to preview");
    }
  };

  const handleSubmit = (data: CourseFormData) => {
    console.log("Form submission data:", data);
    if (file) {
      data.file = file;
      data.fileType = file.type;
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
                {file ? `File selected: ${file.name}` : 'Upload a .txt, .docx, .doc or .pdf file'}
              </p>
            </div>
            
            {(file || (course?.fileData && (
              course?.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
              course?.fileType === 'application/msword' ||
              course?.fileType === 'application/pdf'
            ))) && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePreview}
                leftIcon={<Eye className="h-4 w-4" />}
              >
                Preview Document
              </Button>
            )}
          </div>
          
          {/* Show content text area only for plain text */}
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
                  ? 'PDF file content will be saved and can be previewed by clicking the Preview Document button.'
                  : 'Word document content will be saved and can be previewed by clicking the Preview Document button.'}
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
