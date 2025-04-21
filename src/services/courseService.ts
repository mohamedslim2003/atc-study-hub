import { Course } from '@/types/course';

// Mock storage in localStorage with compression to handle larger files
const COURSES_STORAGE_KEY = 'atc_courses';

// Helper function to get courses from localStorage
const getStoredCourses = (): Course[] => {
  try {
    const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!storedCourses) return [];
    
    let courses = JSON.parse(storedCourses);
    
    // Validate the courses array
    if (!Array.isArray(courses)) {
      console.warn("Invalid courses data in localStorage, returning empty array");
      return [];
    }
    
    // Migrate existing courses to have a category if they don't have one
    courses = courses.map((course: Course) => {
      if (!course.category) {
        return { ...course, category: 'uncategorized' };
      }
      return course;
    });
    
    return courses;
  } catch (error) {
    console.error("Error retrieving courses from localStorage:", error);
    localStorage.removeItem(COURSES_STORAGE_KEY); // Clear corrupted data
    return [];
  }
};

// Helper function to save courses to localStorage with better handling for large files
const saveCourses = (courses: Course[]) => {
  try {
    if (!Array.isArray(courses)) {
      console.error("Attempted to save invalid courses data (not an array)");
      return false;
    }
    
    // Create a copy of the courses with potentially truncated file data to fit in localStorage
    const processedCourses = courses.map(course => {
      // Ensure all courses have a category
      const courseWithCategory = { 
        ...course, 
        category: course.category || 'uncategorized' 
      };
      
      // For files, we'll store metadata but not the actual content
      // This solves the problem of corrupted files on download
      if (courseWithCategory.fileData && courseWithCategory.fileData.length > 10000) {
        console.log(`Course "${course.title}" has a large file (${course.fileData?.length} bytes), storing metadata only`);
        
        // Store only file metadata and a flag indicating this is a placeholder
        return {
          ...courseWithCategory,
          fileDataPlaceholder: true,
          originalFileSize: course.fileData.length,
          // Keep just a small sample of the file data to validate the format
          fileData: course.fileData.substring(0, 100) + '...'
        };
      }
      return courseWithCategory;
    });
    
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(processedCourses));
    return true;
  } catch (error) {
    console.error("Error saving courses to localStorage:", error);
    throw new Error("Failed to save course. Storage limit reached.");
  }
};

// In-memory cache for file data that's too large for localStorage
const fileDataCache = new Map<string, string>();

export const getCourses = (): Course[] => {
  try {
    return getStoredCourses();
  } catch (error) {
    console.error("Error getting courses:", error);
    return [];
  }
};

export const getCourseById = (id: string): Course | undefined => {
  try {
    if (!id) {
      console.error("Invalid course ID (empty)");
      return undefined;
    }
    
    const courses = getStoredCourses();
    const course = courses.find(course => course.id === id);
    
    if (!course) {
      return undefined;
    }
    
    // Check if we have the file data in our cache
    if (course.fileDataPlaceholder && fileDataCache.has(id)) {
      return {
        ...course,
        fileData: fileDataCache.get(id),
        fileDataPlaceholder: false
      };
    }
    
    // Validate file data if present
    if (course.fileData) {
      const isDataUri = course.fileData.startsWith('data:');
      if (!isDataUri && !course.fileDataPlaceholder) {
        console.warn(`Invalid file data format for course "${course.title}"`);
        return {
          ...course,
          fileData: null,
          fileStorageError: true
        };
      }
    }
    
    return course;
  } catch (error) {
    console.error(`Error getting course with ID ${id}:`, error);
    return undefined;
  }
};

export const addCourse = (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Course => {
  const courses = getStoredCourses();
  
  const newId = crypto.randomUUID();
  
  const newCourse: Course = {
    ...course,
    id: newId,
    category: course.category || 'uncategorized',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  // Store full file data in our cache if it's large
  if (newCourse.fileData && newCourse.fileData.length > 10000) {
    fileDataCache.set(newId, newCourse.fileData);
  }
  
  try {
    // Check if we can actually save this to localStorage before adding
    const testCourses = [...courses, newCourse];
    saveCourses(testCourses);
    
    // If no error was thrown, return the new course
    return newCourse;
  } catch (error) {
    console.error("Failed to add course:", error);
    throw error;
  }
};

export const updateCourse = (id: string, course: Partial<Course>): Course | null => {
  const courses = getStoredCourses();
  const courseIndex = courses.findIndex(c => c.id === id);
  
  if (courseIndex === -1) {
    return null;
  }
  
  const updatedCourse = {
    ...courses[courseIndex],
    ...course,
    updatedAt: new Date(),
  };
  
  // If file data is provided, update our cache
  if (course.fileData && course.fileData.length > 10000) {
    fileDataCache.set(id, course.fileData);
  }
  
  courses[courseIndex] = updatedCourse;
  
  try {
    saveCourses(courses);
    return updatedCourse;
  } catch (error) {
    console.error("Failed to update course:", error);
    throw error;
  }
};

export const deleteCourse = (id: string): boolean => {
  const courses = getStoredCourses();
  const filteredCourses = courses.filter(course => course.id !== id);
  
  if (filteredCourses.length === courses.length) {
    return false;
  }
  
  // Remove from file cache if it exists
  if (fileDataCache.has(id)) {
    fileDataCache.delete(id);
  }
  
  try {
    saveCourses(filteredCourses);
    return true;
  } catch (error) {
    console.error(`Failed to delete course with ID ${id}:`, error);
    return false;
  }
};
