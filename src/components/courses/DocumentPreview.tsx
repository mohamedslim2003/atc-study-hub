
import React, { useState } from 'react';
import { FileText, AlertTriangle } from 'lucide-react';
import { Card } from '@/components/ui-custom/Card';

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

  // Helper to handle iframe load events
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Helper to handle iframe errors
  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load document preview');
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

  // For Word documents (docx, doc)
  if (
    fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileType === 'application/msword'
  ) {
    // Using Google Docs Viewer as a fallback for Word documents
    const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileData)}&embedded=true`;
    
    return (
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-2"></div>
              <p>Loading document...</p>
            </div>
          </div>
        )}
        
        <iframe
          src={googleDocsViewerUrl}
          className="w-full h-[600px] border-0 rounded-md"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title={fileName}
        />
        
        {error && (
          <Card className="mt-4 p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
              <p className="text-sm">
                {error} - Word documents may not preview correctly. You can download the file to view it locally.
              </p>
            </div>
          </Card>
        )}
      </div>
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
