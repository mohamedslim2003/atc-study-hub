
export interface Course {
  id: string;
  title: string;
  description: string;
  content: string;
  imageUrl?: string;
  fileData?: string;
  fileType?: string;
  fileName?: string;
  createdAt: Date;
  updatedAt: Date;
}
