
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Define types for our user
export type User = {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: 'admin' | 'user';
};

// Define our context type
type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<boolean>;
  register: (firstName: string, lastName: string, phone: string, password: string) => Promise<boolean>;
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
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'adminpassword';

// Mock user database - would be replaced with a real database
const mockUsers: Record<string, User> = {};

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
  const login = async (username: string, password: string, isAdmin: boolean = false): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Artificial delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Admin login logic
      if (isAdmin) {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          const adminUser: User = {
            id: 'admin-1',
            firstName: 'Admin',
            lastName: 'User',
            phone: '',
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
      // In a real app, this would validate against a database
      const userKey = Object.keys(mockUsers).find(
        key => mockUsers[key].phone === username
      );
      
      if (userKey && password === 'password') { // Using simple password for demo
        setUser(mockUsers[userKey]);
        localStorage.setItem('atc-lms-user', JSON.stringify(mockUsers[userKey]));
        toast.success('Login successful!');
        return true;
      } else {
        toast.error('Invalid login credentials');
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
  const register = async (firstName: string, lastName: string, phone: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // Artificial delay to simulate network request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check if phone number is already registered
      const phoneExists = Object.values(mockUsers).some(user => user.phone === phone);
      
      if (phoneExists) {
        toast.error('Phone number already registered');
        return false;
      }
      
      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        firstName,
        lastName,
        phone,
        role: 'user',
      };
      
      // Add to mock database
      mockUsers[newUser.id] = newUser;
      
      // Auto login after registration
      setUser(newUser);
      localStorage.setItem('atc-lms-user', JSON.stringify(newUser));
      
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
        mockUsers[user.id] = updatedUser;
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
