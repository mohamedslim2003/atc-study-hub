
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define types for our user
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
};

// User with password for internal use
type UserWithPassword = User & {
  password: string;
};

// Define our context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<boolean>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  updateProfile: async () => false,
});

// Hook for easy context use
export const useAuth = () => useContext(AuthContext);

// Admin credentials - hardcoded for demonstration
// In a real application, these would be properly stored in a secure database
const ADMIN_EMAIL = 'trbslim35@gmail.com';
const ADMIN_PASSWORD = 'adminpassword';

// Mock user database - would be replaced with a real database
const mockUsers: Record<string, UserWithPassword> = {};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('atc-lms-user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('atc-lms-user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string, isAdmin: boolean = false): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Artificial delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Admin login logic
      if (isAdmin) {
        if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
          const adminUser: User = {
            id: 'admin-1',
            firstName: 'Admin',
            lastName: 'User',
            email: ADMIN_EMAIL,
            role: 'admin',
          };
          
          setUser(adminUser);
          localStorage.setItem('atc-lms-user', JSON.stringify(adminUser));
          toast.success('Admin login successful!');
          return true;
        } else {
          toast.error('Invalid admin credentials');
          return false;
        }
      }
      
      // Regular user login logic
      // Find user by email
      const userKey = Object.keys(mockUsers).find(
        key => mockUsers[key].email.toLowerCase() === email.toLowerCase()
      );
      
      if (userKey) {
        const foundUser = mockUsers[userKey];
        // Check password
        if (foundUser.password === password) {
          // Don't include password in the user object we store in state
          const { password: _, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem('atc-lms-user', JSON.stringify(userWithoutPassword));
          toast.success('Login successful!');
          return true;
        } else {
          toast.error('Invalid password');
          return false;
        }
      } else {
        toast.error('User not found');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (firstName: string, lastName: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Artificial delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if email is already registered
      const emailExists = Object.values(mockUsers).some(user => 
        user.email.toLowerCase() === email.toLowerCase()
      );
      
      if (emailExists) {
        toast.error('Email is already registered');
        return false;
      }
      
      // Create new user
      const newUser: UserWithPassword = {
        id: `user-${Date.now()}`,
        firstName,
        lastName,
        email,
        role: 'user',
        password,
      };
      
      // Add to mock database
      mockUsers[newUser.id] = newUser;
      
      // Don't include password in the user object we store in state
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Auto login after registration
      setUser(userWithoutPassword);
      localStorage.setItem('atc-lms-user', JSON.stringify(userWithoutPassword));
      
      toast.success('Registration successful!');
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An error occurred during registration');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('atc-lms-user');
    toast.success('Logged out successfully');
  };

  // Update profile function
  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return false;
    }
    
    setLoading(true);
    
    try {
      // Artificial delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update user data
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      // Update in mock database
      if (mockUsers[user.id]) {
        // Preserve the password when updating
        const currentPassword = mockUsers[user.id].password;
        mockUsers[user.id] = { ...updatedUser, password: currentPassword };
      }
      
      // Update local storage
      localStorage.setItem('atc-lms-user', JSON.stringify(updatedUser));
      
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
