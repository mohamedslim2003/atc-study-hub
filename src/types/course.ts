
export interface Course {
  id: string;
  title: string;
  description: string;
  content: string;
  category: 'aerodrome' | 'approach' | 'ccr' | 'uncategorized';
  imageUrl?: string;
  fileData?: string;
  fileType?: string;
  fileName?: string;
  fileStorageError?: boolean; // Added this property to fix the TypeScript error
  createdAt: Date;
  updatedAt: Date;
}
