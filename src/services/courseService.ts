
import { Course } from '@/types/course';
import { supabase } from '@/integrations/supabase/client';

// Supabase storage bucket name
const STORAGE_BUCKET = 'course-files';

// Helper function to get courses from Supabase database
const getStoredCourses = async (): Promise<Course[]> => {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching courses from Supabase:", error);
      return [];
    }
    
    // Map database fields to Course interface
    return (data || []).map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      content: course.content || '',
      category: course.category,
      fileData: course.file_data,
      fileType: course.file_type,
      fileName: course.file_name,
      createdAt: new Date(course.created_at),
      updatedAt: new Date(course.updated_at)
    }));
  } catch (error) {
    console.error("Error retrieving courses:", error);
    return [];
  }
};

// Helper function to upload file to Supabase Storage
const uploadFileToStorage = async (file: File, courseId: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${courseId}.${fileExt}`;
    const filePath = `courses/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
      return null;
    }

    // Get public URL
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error("Error in file upload:", error);
    return null;
  }
};

// Helper function to delete file from Supabase Storage
const deleteFileFromStorage = async (fileUrl: string): Promise<boolean> => {
  try {
    // Extract file path from URL
    const urlParts = fileUrl.split('/');
    const filePath = urlParts.slice(-2).join('/'); // Get "courses/filename.ext"

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([filePath]);

    if (error) {
      console.error("Error deleting file:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in file deletion:", error);
    return false;
  }
};

export const getCourses = async (): Promise<Course[]> => {
  try {
    return await getStoredCourses();
  } catch (error) {
    console.error("Error getting courses:", error);
    return [];
  }
};

export const getCourseById = async (id: string): Promise<Course | undefined> => {
  try {
    if (!id) {
      console.error("Invalid course ID (empty)");
      return undefined;
    }
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Error getting course with ID ${id}:`, error);
      return undefined;
    }
    
    // Map database fields to Course interface
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      content: data.content || '',
      category: data.category,
      fileData: data.file_data,
      fileType: data.file_type,
      fileName: data.file_name,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };
  } catch (error) {
    console.error(`Error getting course with ID ${id}:`, error);
    return undefined;
  }
};

export const addCourse = async (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>, file?: File): Promise<Course> => {
  const newId = crypto.randomUUID();
  
  const newCourse: Course = {
    ...course,
    id: newId,
    category: course.category || 'uncategorized',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  try {
    // Upload file to Supabase Storage if provided
    if (file) {
      const fileUrl = await uploadFileToStorage(file, newId);
      if (fileUrl) {
        newCourse.fileData = fileUrl;
        newCourse.fileType = file.type;
        newCourse.fileName = file.name;
      }
    }
    
    // Save course to database with proper field mapping
    const { data, error } = await supabase
      .from('courses')
      .insert([{
        id: newCourse.id,
        title: newCourse.title,
        description: newCourse.description,
        content: newCourse.content,
        category: newCourse.category,
        file_data: newCourse.fileData,
        file_type: newCourse.fileType,
        file_name: newCourse.fileName,
        created_at: newCourse.createdAt.toISOString(),
        updated_at: newCourse.updatedAt.toISOString()
      }])
      .select()
      .single();
    
    if (error) {
      console.error("Failed to add course:", error);
      throw new Error("Failed to save course to database");
    }
    
    return newCourse;
  } catch (error) {
    console.error("Failed to add course:", error);
    throw error;
  }
};

export const updateCourse = async (id: string, course: Partial<Course>, file?: File): Promise<Course | null> => {
  try {
    const existingCourse = await getCourseById(id);
    if (!existingCourse) {
      return null;
    }
    
    const updatedCourse = {
      ...existingCourse,
      ...course,
      updatedAt: new Date(),
    };
    
    // Handle file upload if new file provided
    if (file) {
      // Delete old file if exists
      if (existingCourse.fileData) {
        await deleteFileFromStorage(existingCourse.fileData);
      }
      
      // Upload new file
      const fileUrl = await uploadFileToStorage(file, id);
      if (fileUrl) {
        updatedCourse.fileData = fileUrl;
        updatedCourse.fileType = file.type;
        updatedCourse.fileName = file.name;
      }
    }
    
    // Update course in database with proper field mapping
    const { data, error } = await supabase
      .from('courses')
      .update({
        title: updatedCourse.title,
        description: updatedCourse.description,
        content: updatedCourse.content,
        category: updatedCourse.category,
        file_data: updatedCourse.fileData,
        file_type: updatedCourse.fileType,
        file_name: updatedCourse.fileName,
        updated_at: updatedCourse.updatedAt.toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Failed to update course:", error);
      throw new Error("Failed to update course in database");
    }
    
    return updatedCourse;
  } catch (error) {
    console.error("Failed to update course:", error);
    throw error;
  }
};

export const deleteCourse = async (id: string): Promise<boolean> => {
  try {
    // Get course to delete associated file
    const course = await getCourseById(id);
    
    // Delete file from storage if exists
    if (course?.fileData) {
      await deleteFileFromStorage(course.fileData);
    }
    
    // Delete course from database
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Failed to delete course with ID ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Failed to delete course with ID ${id}:`, error);
    return false;
  }
};
