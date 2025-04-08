import React, { useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui-custom/Button';
import { Card } from '@/components/ui-custom/Card';
import { useForm } from 'react-hook-form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, Upload, FileText } from 'lucide-react';
import { toast } from 'sonner';

export interface TestFormData {
  title: string;
  description: string;
  duration: number;
  category: 'fundamentals' | 'advanced' | 'airspace' | 'emergency';
  questions: Question[];
  file?: File;
  fileData?: string;
  fileType?: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
}

interface Option {
  id: string;
  text: string;
}

const TestCreationForm: React.FC<{
  onSubmit: (data: TestFormData) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}> = ({ onSubmit, onCancel, isSubmitting = false }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileProcessing, setFileProcessing] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);

  const form = useForm<TestFormData>({
    defaultValues: {
      title: '',
      description: '',
      duration: 60,
      category: 'fundamentals',
      questions: [],
    }
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFile(selectedFile);
        setFileProcessing(true);
        
        // Read file content as base64
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            const base64Data = event.target.result.toString();
            form.setValue('fileData', base64Data);
            form.setValue('fileType', selectedFile.type);
            
            // In a real implementation, you would send this file to your backend
            // to parse the .docx and extract questions + answers
            // For now, we'll simulate this with mock questions
            setTimeout(() => {
              const mockQuestions = generateMockQuestions();
              setQuestions(mockQuestions);
              form.setValue('questions', mockQuestions);
              setFileProcessing(false);
              toast.success("File processed successfully");
            }, 2000);
          }
        };
        
        reader.onerror = () => {
          toast.error("Failed to read file");
          setFileProcessing(false);
        };
        
        reader.readAsDataURL(selectedFile);
      } else {
        toast.error("Please upload a .docx file");
      }
    }
  };

  const generateMockQuestions = (): Question[] => {
    // Generate 5 mock questions with 4 options each
    return Array.from({ length: 5 }, (_, i) => ({
      id: `q${i + 1}`,
      text: `Question ${i + 1}: What is the correct procedure for ${['runway incursion', 'weather deviation', 'communication failure', 'emergency descent', 'traffic conflict'][i]}?`,
      options: Array.from({ length: 4 }, (_, j) => ({
        id: `q${i + 1}o${j + 1}`,
        text: `Option ${j + 1}: ${['Contact tower immediately', 'Follow standard protocol', 'Maintain current altitude', 'Declare emergency'][j]}`
      })),
      correctOptionId: `q${i + 1}o${Math.floor(Math.random() * 4) + 1}`
    }));
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${questions.length + 1}`,
      text: '',
      options: [
        { id: `q${questions.length + 1}o1`, text: '' },
        { id: `q${questions.length + 1}o2`, text: '' },
      ],
      correctOptionId: `q${questions.length + 1}o1`
    };
    
    setQuestions([...questions, newQuestion]);
    form.setValue('questions', [...questions, newQuestion]);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    const newOption = {
      id: `q${questionIndex + 1}o${question.options.length + 1}`,
      text: ''
    };
    
    question.options.push(newOption);
    setQuestions(updatedQuestions);
    form.setValue('questions', updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    form.setValue('questions', updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    const question = updatedQuestions[questionIndex];
    
    // Ensure we keep at least two options
    if (question.options.length <= 2) {
      toast.error("A question must have at least two options");
      return;
    }
    
    question.options = question.options.filter((_, i) => i !== optionIndex);
    
    // Update correctOptionId if the removed option was the correct one
    const removedOptionId = `q${questionIndex + 1}o${optionIndex + 1}`;
    if (question.correctOptionId === removedOptionId) {
      question.correctOptionId = question.options[0].id;
    }
    
    setQuestions(updatedQuestions);
    form.setValue('questions', updatedQuestions);
  };

  const updateQuestionText = (index: number, text: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = text;
    setQuestions(updatedQuestions);
    form.setValue('questions', updatedQuestions);
  };

  const updateOptionText = (questionIndex: number, optionIndex: number, text: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].text = text;
    setQuestions(updatedQuestions);
    form.setValue('questions', updatedQuestions);
  };

  const setCorrectOption = (questionIndex: number, optionId: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].correctOptionId = optionId;
    setQuestions(updatedQuestions);
    form.setValue('questions', updatedQuestions);
  };

  const handleSubmit = (data: TestFormData) => {
    // Add questions data to the form submission
    data.questions = questions;
    if (file) {
      data.file = file;
      data.fileType = file.type;
    }
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Test Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter test title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter test description" 
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
                      <RadioGroupItem value="fundamentals" id="fundamentals" />
                    </FormControl>
                    <FormLabel htmlFor="fundamentals" className="font-normal cursor-pointer">
                      Fundamentals
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="advanced" id="advanced" />
                    </FormControl>
                    <FormLabel htmlFor="advanced" className="font-normal cursor-pointer">
                      Advanced
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="airspace" id="airspace" />
                    </FormControl>
                    <FormLabel htmlFor="airspace" className="font-normal cursor-pointer">
                      Airspace
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="emergency" id="emergency" />
                    </FormControl>
                    <FormLabel htmlFor="emergency" className="font-normal cursor-pointer">
                      Emergency
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="border rounded-md p-4 space-y-4">
          <p className="text-sm font-medium">Upload Test Document</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex flex-col gap-2">
              <Input 
                id="file" 
                type="file" 
                onChange={handleFileChange}
                accept=".docx"
                className="max-w-64"
                disabled={fileProcessing}
              />
              <p className="text-sm text-muted-foreground">
                {file ? `File selected: ${file.name}` : 'Upload a .docx file to automatically generate questions'}
              </p>
            </div>
            
            {fileProcessing && (
              <div className="flex items-center text-primary">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing document...
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Questions</h3>
            <Button 
              type="button" 
              onClick={addQuestion}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Question
            </Button>
          </div>
          
          {questions.length === 0 && !fileProcessing && (
            <Card className="p-6 bg-muted/50 flex flex-col items-center justify-center space-y-2">
              <FileText className="h-12 w-12 text-muted-foreground/70" />
              <p className="text-center text-muted-foreground">
                No questions added yet. Upload a .docx file to automatically generate questions or add them manually.
              </p>
            </Card>
          )}
          
          {questions.map((question, qIndex) => (
            <Card key={question.id} className="p-4 space-y-4">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <FormLabel className="mb-2 block" htmlFor={`question-${qIndex}`}>Question {qIndex + 1}</FormLabel>
                  <Textarea
                    id={`question-${qIndex}`}
                    value={question.text}
                    onChange={(e) => updateQuestionText(qIndex, e.target.value)}
                    placeholder="Enter your question"
                    className="mb-2"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeQuestion(qIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="pl-4 space-y-4">
                <FormLabel className="mb-2 block">Options</FormLabel>
                {question.options.map((option, oIndex) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <Checkbox
                      id={option.id}
                      checked={question.correctOptionId === option.id}
                      onCheckedChange={() => setCorrectOption(qIndex, option.id)}
                    />
                    <Input
                      value={option.text}
                      onChange={(e) => updateOptionText(qIndex, oIndex, e.target.value)}
                      placeholder={`Option ${oIndex + 1}`}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeOption(qIndex, oIndex)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addOption(qIndex)}
                  leftIcon={<Plus className="h-4 w-4" />}
                  className="mt-2"
                >
                  Add Option
                </Button>
              </div>
            </Card>
          ))}
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
            disabled={questions.length === 0}
          >
            Create Test
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TestCreationForm;
