
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui-custom/Card';
import { FileText, Search, Filter, Trophy, Clock, BarChart, Calendar, Eye, Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import DocumentPreview from '@/components/courses/DocumentPreview';
import { toast } from 'sonner';
import CreateTestDialog from '@/components/tests/CreateTestDialog';
import { useAuth } from '@/hooks/useAuth';

// Mock test data with base64 data field for the document
// In a real app, this would come from your backend or services
const mockTest = {
  id: '1',
  title: 'ATC Fundamentals Assessment',
  description: 'A comprehensive test covering basic ATC concepts, regulations, and standard procedures.',
  duration: 60,
  questions: 50,
  level: 'Beginner',
  status: 'available',
  category: 'fundamentals',
  // This will be replaced with actual document data in a real implementation
  fileData: '', // Placeholder for your actual docx file data
  fileType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  fileName: 'ATC_Fundamentals_Test.docx'
};

const TestsPage: React.FC = () => {
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const { isAdmin } = useAuth();

  // Function to handle document preview
  const handlePreview = () => {
    // For a .docx file, we would typically open a dialog explaining how to download it
    // since browsers can't directly preview .docx files
    setShowPreviewDialog(true);
  };

  // Function to handle document download
  const handleDownload = () => {
    // In a real implementation, this would download the actual file
    // For now, we'll just show a toast message
    toast.info("In a real implementation, this would download your test document");
  };

  return (
    <div className="animate-enter">
      <header className="mb-8">
        <div className="flex items-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-4">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Tests</h1>
            <p className="text-muted-foreground mt-1">
              Assess your knowledge with mock exams
            </p>
          </div>
          {isAdmin && (
            <div className="ml-auto">
              <Button 
                onClick={() => setShowCreateDialog(true)}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Create Test
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Stats cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tests Completed</p>
                <h3 className="text-2xl font-bold mt-1">0</h3>
              </div>
              <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Score</p>
                <h3 className="text-2xl font-bold mt-1">0%</h3>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Trophy className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Scheduled Test</p>
                <h3 className="text-2xl font-bold mt-1">Today</h3>
              </div>
              <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and filters */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search tests..." 
                  className="pl-9" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="md:w-auto" leftIcon={<Filter className="h-4 w-4" />}>
                Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Tests Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Available Tests</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            <div className="p-6 hover:bg-muted/40 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <FileText className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{mockTest.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      {mockTest.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                        <Clock className="h-3 w-3 mr-1" /> {mockTest.duration} minutes
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                        <FileText className="h-3 w-3 mr-1" /> {mockTest.questions} questions
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                        <BarChart className="h-3 w-3 mr-1" /> {mockTest.level}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 md:flex-col lg:flex-row">
                  <Button 
                    variant="outline" 
                    leftIcon={<Eye className="h-4 w-4" />}
                    onClick={handlePreview}
                    className="flex-1"
                  >
                    Preview
                  </Button>
                  <Button 
                    leftIcon={<Download className="h-4 w-4" />}
                    onClick={handleDownload}
                    className="flex-1"
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Coming Soon Section - Keep this section to show future tests */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-lg flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-primary" />
                Advanced ATC Procedures
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground mb-4">
                Test your knowledge of advanced ATC procedures, emergency situations, and non-standard operations.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                  <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">90 min</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                  <FileText className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">70 questions</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                  <BarChart className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">Advanced</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2 border-b">
              <CardTitle className="text-lg flex items-center">
                <Trophy className="h-5 w-5 mr-2 text-primary" />
                Airspace Classification Quiz
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5">
              <p className="text-sm text-muted-foreground mb-4">
                Test your knowledge of airspace classifications, restrictions, and special use airspace.
              </p>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                  <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">45 min</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                  <FileText className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">30 questions</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                  <BarChart className="h-4 w-4 text-muted-foreground mb-1" />
                  <span className="text-xs font-medium">Intermediate</span>
                </div>
              </div>
              <Button variant="outline" className="w-full" disabled>Coming Soon</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Document Preview Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>{mockTest.fileName}</DialogTitle>
          <div className="space-y-4">
            <div className="flex items-start">
              <FileText className="h-10 w-10 text-primary mr-4 mt-1" />
              <div>
                <h4 className="font-medium mb-1">Document Details</h4>
                <p className="text-sm text-muted-foreground mb-2">Type: Word Document (.docx)</p>
                <p className="text-sm text-muted-foreground">
                  Microsoft Word documents require Microsoft Word or another compatible application to view. 
                  Please download the file to view its contents.
                </p>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleDownload}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Download Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Test Dialog */}
      <CreateTestDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </div>
  );
};

export default TestsPage;
