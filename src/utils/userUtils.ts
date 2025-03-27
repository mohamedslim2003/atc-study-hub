
// This file provides utility functions to access the mock user database

import { User } from '@/context/AuthContext';

// Get the count of registered users (excluding admin)
export const getUsersCount = (): number => {
  // Access the mockUsers object from AuthContext
  // Since we can't directly import it (it's a private variable),
  // we need to access it through localStorage for now
  
  let count = 0;
  
  // Iterate through localStorage to find all user entries
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('user-')) {
      count++;
    }
  }
  
  return count;
};

// Get all registered users (excluding admin)
export const getAllUsers = (): User[] => {
  const users: User[] = [];
  
  // Iterate through localStorage to find all user entries
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('user-')) {
      try {
        const storedUser = JSON.parse(localStorage.getItem(key) || '{}');
        
        // Make sure it's not an admin user
        if (storedUser.role !== 'admin') {
          // Add grades if not present
          if (!storedUser.grades) {
            storedUser.grades = {
              test1: Math.floor(Math.random() * 100),
              test2: Math.floor(Math.random() * 100),
              test3: Math.floor(Math.random() * 100),
            };
            // Save back to localStorage with grades
            localStorage.setItem(key, JSON.stringify(storedUser));
          }
          
          users.push(storedUser);
        }
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
  }
  
  return users;
};

// Check if an email is already registered
export const isEmailRegistered = (email: string): boolean => {
  // Check if email exists in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith('user-')) {
      try {
        const storedUser = JSON.parse(localStorage.getItem(key) || '{}');
        if (storedUser.email?.toLowerCase() === email.toLowerCase()) {
          return true;
        }
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
  }
  return false;
};

// This function allows us to track newly registered users
export const trackNewUser = (user: User): void => {
  // Add initial grades for new users
  const userWithGrades = {
    ...user,
    grades: {
      test1: Math.floor(Math.random() * 100),
      test2: Math.floor(Math.random() * 100),
      test3: Math.floor(Math.random() * 100),
    }
  };
  
  // Store each user in a separate localStorage entry for tracking
  localStorage.setItem(`user-${user.id}`, JSON.stringify(userWithGrades));
  
  // Update the total user count
  const currentCount = Number(localStorage.getItem('total-users-count') || '0');
  localStorage.setItem('total-users-count', String(currentCount + 1));
};

// Get the total user count
export const getTotalUsersCount = (): number => {
  return Number(localStorage.getItem('total-users-count') || '0');
};

// Update a user's grades
export const updateUserGrades = (userId: string, grades: {[key: string]: number}): boolean => {
  const key = `user-${userId}`;
  try {
    const storedUser = JSON.parse(localStorage.getItem(key) || '{}');
    if (storedUser.id) {
      storedUser.grades = {
        ...storedUser.grades,
        ...grades
      };
      localStorage.setItem(key, JSON.stringify(storedUser));
      return true;
    }
  } catch (e) {
    console.error('Error updating user grades:', e);
  }
  return false;
};

// Get a user by ID
export const getUserById = (userId: string): User | null => {
  const key = `user-${userId}`;
  try {
    const storedUser = JSON.parse(localStorage.getItem(key) || '{}');
    if (storedUser.id) {
      return storedUser;
    }
  } catch (e) {
    console.error('Error getting user by ID:', e);
  }
  return null;
};

