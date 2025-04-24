
import { Test, TestSubmission } from '@/types/test';
import { getCourses, getCourseById } from './courseService';

const TEST_STORAGE_KEY = 'atc_tests';
const TEST_SUBMISSIONS_KEY = 'atc_test_submissions';

// Helper function to get tests from localStorage
const getStoredTests = (): Test[] => {
  try {
    const storedTests = localStorage.getItem(TEST_STORAGE_KEY);
    if (!storedTests) return [];
    
    const tests = JSON.parse(storedTests);
    
    if (!Array.isArray(tests)) {
      console.warn("Invalid tests data in localStorage, returning empty array");
      return [];
    }
    
    return tests;
  } catch (error) {
    console.error("Error retrieving tests from localStorage:", error);
    localStorage.removeItem(TEST_STORAGE_KEY);
    return [];
  }
};

// Helper function to save tests to localStorage
const saveTests = (tests: Test[]): boolean => {
  try {
    if (!Array.isArray(tests)) {
      console.error("Attempted to save invalid tests data (not an array)");
      return false;
    }
    
    localStorage.setItem(TEST_STORAGE_KEY, JSON.stringify(tests));
    return true;
  } catch (error) {
    console.error("Error saving tests to localStorage:", error);
    return false;
  }
};

// Helper function to get test submissions from localStorage
const getStoredSubmissions = (): TestSubmission[] => {
  try {
    const storedSubmissions = localStorage.getItem(TEST_SUBMISSIONS_KEY);
    if (!storedSubmissions) return [];
    
    const submissions = JSON.parse(storedSubmissions);
    
    if (!Array.isArray(submissions)) {
      console.warn("Invalid test submissions data in localStorage, returning empty array");
      return [];
    }
    
    return submissions;
  } catch (error) {
    console.error("Error retrieving test submissions from localStorage:", error);
    localStorage.removeItem(TEST_SUBMISSIONS_KEY);
    return [];
  }
};

// Helper function to save test submissions to localStorage
const saveSubmissions = (submissions: TestSubmission[]): boolean => {
  try {
    if (!Array.isArray(submissions)) {
      console.error("Attempted to save invalid test submissions data (not an array)");
      return false;
    }
    
    localStorage.setItem(TEST_SUBMISSIONS_KEY, JSON.stringify(submissions));
    return true;
  } catch (error) {
    console.error("Error saving test submissions to localStorage:", error);
    return false;
  }
};

export const getTests = (): Test[] => {
  return getStoredTests();
};

export const getTestById = (id: string): Test | undefined => {
  const tests = getStoredTests();
  return tests.find(test => test.id === id);
};

export const getTestsByCourse = (courseId: string): Test[] => {
  const tests = getStoredTests();
  return tests.filter(test => test.courseId === courseId);
};

export const createTest = (test: Omit<Test, 'id' | 'createdAt' | 'updatedAt'>): Test => {
  const tests = getStoredTests();
  
  const newTest: Test = {
    ...test,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const updatedTests = [...tests, newTest];
  saveTests(updatedTests);
  
  return newTest;
};

export const updateTest = (id: string, updatedFields: Partial<Test>): Test | null => {
  const tests = getStoredTests();
  const testIndex = tests.findIndex(test => test.id === id);
  
  if (testIndex === -1) {
    return null;
  }
  
  const updatedTest = {
    ...tests[testIndex],
    ...updatedFields,
    updatedAt: new Date()
  };
  
  tests[testIndex] = updatedTest;
  saveTests(tests);
  
  return updatedTest;
};

export const deleteTest = (id: string): boolean => {
  const tests = getStoredTests();
  const filteredTests = tests.filter(test => test.id !== id);
  
  if (filteredTests.length === tests.length) {
    return false;
  }
  
  return saveTests(filteredTests);
};

export const submitTest = (submission: Omit<TestSubmission, 'id' | 'submittedAt'>): TestSubmission => {
  const submissions = getStoredSubmissions();
  
  const newSubmission: TestSubmission = {
    ...submission,
    id: crypto.randomUUID(),
    submittedAt: new Date()
  };
  
  const updatedSubmissions = [...submissions, newSubmission];
  saveSubmissions(updatedSubmissions);
  
  return newSubmission;
};

export const getUserTestSubmissions = (userId: string): TestSubmission[] => {
  const submissions = getStoredSubmissions();
  return submissions.filter(submission => submission.userId === userId);
};

export const getTestSubmission = (testId: string, userId: string): TestSubmission | undefined => {
  const submissions = getStoredSubmissions();
  return submissions.find(submission => submission.testId === testId && submission.userId === userId);
};
