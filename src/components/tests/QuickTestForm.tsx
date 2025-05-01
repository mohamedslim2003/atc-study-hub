
import React from 'react';
import { Button } from '@/components/ui-custom/Button';
import { X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-custom/Card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';

export interface QuickTestFormData {
  title: string;
  description: string;
  duration: number;
  category: 'fundamentals' | 'advanced' | 'airspace' | 'emergency';
  question: string;
  options: string[];
  correctOptionIndex: number;
}

interface QuickTestFormProps {
  onSubmit: (data: QuickTestFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const QuickTestForm: React.FC<QuickTestFormProps> = ({ onSubmit, onCancel, isSubmitting }) => {
  const form = useForm<QuickTestFormData>({
    defaultValues: {
      title: '',
      description: '',
      duration: 15,
      category: 'fundamentals',
      question: '',
      options: ['', '', '', ''],
      correctOptionIndex: 0
    }
  });

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quick Create Test</CardTitle>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      className="min-h-16"
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
              <h3 className="text-lg font-medium">Question</h3>
              
              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Text</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter your question here..." 
                        className="min-h-16"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-4">
                <h4 className="font-medium">Options</h4>
                
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Checkbox 
                      id={`option-${index}`} 
                      checked={form.watch('correctOptionIndex') === index}
                      onCheckedChange={() => form.setValue('correctOptionIndex', index)}
                    />
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={form.watch('options')[index]}
                      onChange={(e) => {
                        const newOptions = [...form.watch('options')];
                        newOptions[index] = e.target.value;
                        form.setValue('options', newOptions);
                      }}
                      className="flex-1"
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit"
                isLoading={isSubmitting}
              >
                Create Test
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default QuickTestForm;
