
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

// This function allows us to track newly registered users
export const trackNewUser = (user: User): void => {
  // Store each user in a separate localStorage entry for tracking
  localStorage.setItem(`user-${user.id}`, JSON.stringify(user));
  
  // Update the total user count
  const currentCount = Number(localStorage.getItem('total-users-count') || '0');
  localStorage.setItem('total-users-count', String(currentCount + 1));
};

// Get the total user count
export const getTotalUsersCount = (): number => {
  return Number(localStorage.getItem('total-users-count') || '0');
};
