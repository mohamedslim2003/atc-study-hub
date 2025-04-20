
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
  fileStorageError?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
