
import React, { useState } from 'react';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface DocumentPreviewProps {
  fileData: string;
  fileType: string;
  fileName?: string;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  fileData,
  fileType,
  fileName = 'document'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWordPreviewDialog, setShowWordPreviewDialog] = useState(false);
  
  // Helper to handle iframe load events
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Helper to handle iframe errors
  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load document preview');
  };

  // Function to trigger download of document
  const handleDownloadDocument = () => {
    // Create a download link for the document
    const link = document.createElement('a');
    link.href = fileData;
    
    // Set the filename with appropriate extension
    let fileExtension = 'txt';
    if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      fileExtension = 'docx';
    } else if (fileType === 'application/msword') {
      fileExtension = 'doc';
    } else if (fileType === 'application/pdf') {
      fileExtension = 'pdf';
    }
    
    link.download = fileName || `document.${fileExtension}`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // For text files, display content directly
  if (fileType === 'text/plain') {
    return (
      <div className="bg-white rounded-md shadow p-4 max-h-[600px] overflow-auto">
        <pre className="whitespace-pre-wrap">{fileData}</pre>
      </div>
    );
  }

  // For PDF files
  if (fileType === 'application/pdf') {
    return (
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-2"></div>
              <p>Loading PDF...</p>
            </div>
          </div>
        )}
        <iframe
          src={fileData}
          className="w-full h-[600px] border-0 rounded-md"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title={fileName}
        />
      </div>
    );
  }

  // For Word documents (docx, doc) - we'll show a preview dialog instead of embedding
  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileType === 'application/msword'
  ) {
    // Create a more user-friendly message
    const fileTypeDisplay = fileType.includes('openxmlformats') ? 'Word Document (.docx)' : 'Word Document (.doc)';
    
    return (
      <>
        <div className="bg-white rounded-md shadow p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <FileText className="h-16 w-16 text-primary mb-4" />
            <h3 className="text-xl font-medium mb-2">{fileName || 'Document'}</h3>
            <p className="text-muted-foreground mb-2">{fileTypeDisplay}</p>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
              Word documents cannot be displayed directly in the browser. Please use the download option below to view the document.
            </p>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => setShowWordPreviewDialog(true)}
                leftIcon={<FileText className="h-4 w-4" />}
              >
                View Document Information
              </Button>
              
              <Button
                onClick={handleDownloadDocument}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Download for Viewing
              </Button>
            </div>
          </div>
        </div>
        
        {/* Dialog with document information */}
        <Dialog open={showWordPreviewDialog} onOpenChange={setShowWordPreviewDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle>{fileName || 'Document'}</DialogTitle>
            <div className="space-y-4">
              <div className="flex items-start">
                <FileText className="h-10 w-10 text-primary mr-4 mt-1" />
                <div>
                  <h4 className="font-medium mb-1">Document Details</h4>
                  <p className="text-sm text-muted-foreground mb-2">Type: {fileTypeDisplay}</p>
                  <p className="text-sm text-muted-foreground">
                    Microsoft Word documents require Microsoft Word or another compatible application to view. 
                    Please download the file to view its contents.
                  </p>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleDownloadDocument}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Download Document
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Fallback for unsupported file types
  return (
    <div className="bg-muted/30 rounded-md p-6 flex flex-col items-center justify-center">
      <FileText className="h-12 w-12 text-primary mx-auto mb-3" />
      <h3 className="text-lg font-medium">{fileName || 'Document'}</h3>
      <p className="text-muted-foreground text-center mt-2">
        Preview not available for this file type. Please download the file to view it.
      </p>
    </div>
  );
};

export default DocumentPreview;
