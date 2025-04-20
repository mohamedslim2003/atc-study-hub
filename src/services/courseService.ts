
import { Course } from '@/types/course';

// Mock storage in localStorage with compression to handle larger files
const COURSES_STORAGE_KEY = 'atc_courses';

// Helper function to get courses from localStorage
const getStoredCourses = (): Course[] => {
  try {
    const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!storedCourses) return [];
    
    let courses = JSON.parse(storedCourses);
    
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
    return [];
  }
};

// Helper function to save courses to localStorage with better handling for large files
const saveCourses = (courses: Course[]) => {
  try {
    // Create a copy of the courses with potentially truncated file data to fit in localStorage
    const processedCourses = courses.map(course => {
      // Ensure all courses have a category
      const courseWithCategory = { 
        ...course, 
        category: course.category || 'uncategorized' 
      };
      
      // If there's file data and it's very large, we'll need to handle it specially
      if (courseWithCategory.fileData && courseWithCategory.fileData.length > 500000) {
        // For very large files, keep more data than before, but still truncate if needed
        // This helps provide a better partial download experience
        console.log(`Course "${course.title}" has a large file (${course.fileData.length} bytes), saving partial content for storage`);
        
        // Keep a larger portion of the file (first megabyte) for better download experience
        const truncatedData = courseWithCategory.fileData.substring(0, 1000000);
        
        // Keep the file metadata and add a flag indicating the file is too large for complete preview
        return {
          ...courseWithCategory,
          fileData: truncatedData,
          fileStorageError: true
        };
      }
      return courseWithCategory;
    });
    
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(processedCourses));
  } catch (error) {
    console.error("Error saving courses to localStorage:", error);
    throw new Error("Failed to save course. The file might be too large for browser storage.");
  }
};

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
    const courses = getStoredCourses();
    return courses.find(course => course.id === id);
  } catch (error) {
    console.error(`Error getting course with ID ${id}:`, error);
    return undefined;
  }
};

export const addCourse = (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Course => {
  const courses = getStoredCourses();
  
  const newCourse: Course = {
    ...course,
    id: crypto.randomUUID(),
    category: course.category || 'uncategorized',
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
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
  
  try {
    saveCourses(filteredCourses);
    return true;
  } catch (error) {
    console.error(`Failed to delete course with ID ${id}:`, error);
    return false;
  }
};
