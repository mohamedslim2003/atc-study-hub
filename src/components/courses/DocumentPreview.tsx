
import React, { useState, useEffect } from 'react';
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
    // For Word documents, use Microsoft's Office Online viewer or Google Docs viewer
    // Note: This requires the document to be publicly accessible via a URL
    
    // Attempt to use Office Online viewer first
    // Need to ensure the fileData is a URL and not a base64 string for this to work
    const isDataUrl = fileData.startsWith('data:');
    let viewerUrl;
    
    if (isDataUrl) {
      // If it's a data URL, we need to convert it to a Blob for download
      // But for preview we can use Google Docs viewer as fallback
      viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.href)}&wdStartOn=1`;
    } else {
      // If it's already a URL, use it directly
      viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileData)}&wdStartOn=1`;
    }
    
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
          src={viewerUrl}
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
                {error} - Word documents may not preview correctly in the browser. Please download the file to view it locally.
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
