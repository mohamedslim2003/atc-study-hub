import React, { useState, useEffect } from 'react';
import { FileText, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

interface DocumentPreviewProps {
  fileData: string;
  fileType: string;
  fileName?: string;
  hasStorageError?: boolean;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  fileData,
  fileType,
  fileName = 'document',
  hasStorageError = false
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWordPreviewDialog, setShowWordPreviewDialog] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Validate file data
  useEffect(() => {
    if (!fileData || fileData.length < 10) {
      setError('Invalid or missing file data');
      setIsLoading(false);
      return;
    }
    
    // Validate data URI format
    if (!fileData.startsWith('data:')) {
      setError('Invalid file data format');
      setIsLoading(false);
    }
  }, [fileData]);
  
  // Helper to handle iframe load events
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Helper to handle iframe errors
  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load document preview');
  };

  // Function to trigger download of document with progress
  const handleDownloadDocument = () => {
    if (isDownloading) return;
    
    if (!fileData || fileData.length < 50) {
      toast.error('Invalid file data. Please try again or contact support.');
      return;
    }
    
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
              const matches = fileData.match(dataUriRegex);
              
              if (!matches || matches.length !== 3) {
                throw new Error('Invalid file data format');
              }
              
              const contentType = matches[1];
              const base64Data = matches[2];
              
              // Fix: Clean the base64 string to ensure it's properly formatted
              const cleanedBase64 = base64Data.replace(/\s/g, '').replace(/[^A-Za-z0-9+/=]/g, '');
              
              try {
                // Convert Base64 to binary in a more reliable way
                const byteCharacters = atob(cleanedBase64);
                const byteArrays = [];
                
                // Process the binary data in smaller chunks to prevent memory issues
                const chunkSize = 8192; // Process 8KB at a time
                for (let offset = 0; offset < byteCharacters.length; offset += chunkSize) {
                  const slice = byteCharacters.slice(offset, Math.min(offset + chunkSize, byteCharacters.length));
                  
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
                if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                  fileExtension = 'docx';
                } else if (fileType === 'application/msword') {
                  fileExtension = 'doc';
                } else if (fileType === 'application/pdf') {
                  fileExtension = 'pdf';
                }
                
                // Use the provided fileName if available, otherwise create a generic one
                const downloadName = fileName && fileName.trim() !== '' 
                  ? (fileName.includes('.') ? fileName : `${fileName}.${fileExtension}`)
                  : `document.${fileExtension}`;
                
                const link = document.createElement('a');
                link.href = url;
                link.download = downloadName;
                
                // Trigger the download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Cleanup
                URL.revokeObjectURL(url);
                
                if (hasStorageError) {
                  toast.info('The file was only partially downloaded due to browser storage limitations. Some content may be missing.', { duration: 7000 });
                } else {
                  toast.success('Download completed successfully');
                }
              } catch (atobError) {
                console.error('Download error:', atobError);
                toast.error('Failed to decode the file. The file data may be corrupted.');
              }
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

  // Display a warning if there's a storage error
  if (hasStorageError) {
    return (
      <div className="bg-white rounded-md shadow p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <FileText className="h-16 w-16 text-amber-500 mb-4" />
          <h3 className="text-xl font-medium mb-2">{fileName || 'Document'}</h3>
          <p className="text-amber-500 mb-6">This file exceeds browser storage limits and is only partially available.</p>
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            You can still download the partial file, but it may not contain all content. The downloaded file may be corrupted.
          </p>
          
          <Button
            onClick={handleDownloadDocument}
            leftIcon={<Download className="h-4 w-4" />}
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download Partial File'}
          </Button>
          
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
      </div>
    );
  }

  // If there's an error with the file data
  if (error) {
    return (
      <div className="bg-white rounded-md shadow p-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error with Document</AlertTitle>
          <AlertDescription>
            {error}. The document may be corrupted or unavailable.
          </AlertDescription>
        </Alert>
        
        <div className="flex flex-col items-center text-center mt-6">
          <FileText className="h-16 w-16 text-destructive mb-4" />
          <h3 className="text-xl font-medium mb-2">{fileName || 'Document'}</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md">
            The document preview could not be loaded. This could be due to browser storage limitations or a corrupted file.
          </p>
        </div>
      </div>
    );
  }

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
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading PDF</AlertTitle>
            <AlertDescription>
              Failed to load the PDF. Please try downloading the file instead.
            </AlertDescription>
          </Alert>
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

  // For Word documents (docx, doc) - show a preview dialog instead of embedding
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
                disabled={isDownloading}
              >
                {isDownloading ? 'Downloading...' : 'Download for Viewing'}
              </Button>
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
        </div>
        
        {/* Dialog with document information */}
        <Dialog open={showWordPreviewDialog} onOpenChange={setShowWordPreviewDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle>{fileName || 'Document'}</DialogTitle>
            <DialogDescription>
              Document details and download options.
            </DialogDescription>
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
                disabled={isDownloading}
              >
                {isDownloading ? 'Downloading...' : 'Download Document'}
              </Button>
              
              {isDownloading && (
                <div className="mt-2 w-full">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Downloading...</span>
                    <span>{downloadProgress}%</span>
                  </div>
                  <Progress value={downloadProgress} className="h-2" />
                </div>
              )}
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
      
      <Button
        onClick={handleDownloadDocument}
        leftIcon={<Download className="h-4 w-4" />}
        className="mt-4"
        disabled={isDownloading}
      >
        {isDownloading ? 'Downloading...' : 'Download File'}
      </Button>
      
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
  );
};

export default DocumentPreview;
