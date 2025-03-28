
import { Course } from '@/types/course';

// Mock storage in localStorage
const COURSES_STORAGE_KEY = 'atc_courses';

// Helper function to get courses from localStorage
const getStoredCourses = (): Course[] => {
  const storedCourses = localStorage.getItem(COURSES_STORAGE_KEY);
  return storedCourses ? JSON.parse(storedCourses) : [];
};

// Helper function to save courses to localStorage
const saveCourses = (courses: Course[]) => {
  localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
};

export const getCourses = (): Course[] => {
  return getStoredCourses();
};

export const getCourseById = (id: string): Course | undefined => {
  const courses = getStoredCourses();
  return courses.find(course => course.id === id);
};

export const addCourse = (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt'>): Course => {
  const courses = getStoredCourses();
  
  const newCourse: Course = {
    ...course,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  courses.push(newCourse);
  saveCourses(courses);
  
  return newCourse;
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
  saveCourses(courses);
  
  return updatedCourse;
};

export const deleteCourse = (id: string): boolean => {
  const courses = getStoredCourses();
  const filteredCourses = courses.filter(course => course.id !== id);
  
  if (filteredCourses.length === courses.length) {
    return false;
  }
  
  saveCourses(filteredCourses);
  return true;
};
