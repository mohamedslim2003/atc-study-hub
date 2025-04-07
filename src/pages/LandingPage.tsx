
import React, { useEffect } from 'react';
import { Button } from '@/components/ui-custom/Button';
import { Card, CardContent } from '@/components/ui-custom/Card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Shield, LogIn, UserPlus, PlaneLanding, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { Toggle } from '@/components/ui/toggle';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  return (
    <div className="min-h-screen flex flex-col relative transition-colors duration-500">
      {/* Background Image with dark overlay for dark mode */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-500" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1530333821974-f9fcfd640f17?ixlib=rb-4.0.3&auto=format&fit=crop&q=80")',
          backgroundBlendMode: 'overlay',
          backgroundColor: theme === 'dark' ? 'rgba(10, 15, 25, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        }}
      />
      
      {/* Content Layer */}
      <div className="min-h-screen flex flex-col relative z-10 bg-secondary/60 backdrop-blur-sm dark:bg-secondary/20 transition-all duration-500">
        {/* Header */}
        <header className="bg-white/90 dark:bg-card/90 shadow-sm py-4 backdrop-blur-sm transition-all duration-500">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary dark:text-primary">ATC Study Hub</h1>
            
            {/* Theme toggle */}
            <Toggle
              pressed={theme === 'dark'}
              onPressedChange={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 transition-all duration-300"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 transition-all duration-300" />
              ) : (
                <Moon className="h-4 w-4 transition-all duration-300" />
              )}
            </Toggle>
          </div>
        </header>
        
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center p-4 md:p-8 transition-colors duration-500">
          <div className="max-w-4xl w-full mx-auto animate-enter">
            <div className="text-center mb-10">
              <h1 className="heading-1 text-gradient mb-4 transition-all duration-500">
                Air Traffic Control Study Hub
              </h1>
              <p className="text-xl text-foreground dark:text-foreground font-medium max-w-2xl mx-auto transition-colors duration-500">
                Your dedicated learning platform for mastering air traffic control concepts and passing your exams with confidence.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {/* Admin Card */}
              <Card hover glass className="transition-all duration-500">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4 transition-colors duration-500">
                    <Shield className="h-8 w-8 text-primary dark:text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 transition-colors duration-500">Admin</h3>
                  <p className="text-muted-foreground dark:text-muted-foreground text-sm mb-4 transition-colors duration-500">
                    Manage courses, exercises, and student progress
                  </p>
                  <Button 
                    variant="primary" 
                    className="w-full transition-all duration-300"
                    onClick={() => navigate('/admin-login')}
                  >
                    Admin Login
                  </Button>
                </CardContent>
              </Card>
              
              {/* User Card */}
              <Card hover glass className="transition-all duration-500">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4 transition-colors duration-500">
                    <LogIn className="h-8 w-8 text-primary dark:text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 transition-colors duration-500">User</h3>
                  <p className="text-muted-foreground dark:text-muted-foreground text-sm mb-4 transition-colors duration-500">
                    Access your courses, practice exercises, and take tests
                  </p>
                  <Button 
                    variant="primary"
                    className="w-full transition-all duration-300"
                    leftIcon={<LogIn className="h-4 w-4" />}
                    onClick={() => navigate('/login')}
                  >
                    User Login
                  </Button>
                </CardContent>
              </Card>
              
              {/* Register Card */}
              <Card hover glass className="transition-all duration-500">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4 transition-colors duration-500">
                    <UserPlus className="h-8 w-8 text-primary dark:text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 transition-colors duration-500">Register</h3>
                  <p className="text-muted-foreground dark:text-muted-foreground text-sm mb-4 transition-colors duration-500">
                    Create a new account to start your ATC learning journey
                  </p>
                  <Button 
                    variant="primary"
                    className="w-full transition-all duration-300"
                    leftIcon={<UserPlus className="h-4 w-4" />}
                    onClick={() => navigate('/register')}
                  >
                    Register
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-white/90 dark:bg-card/90 py-4 border-t backdrop-blur-sm transition-colors duration-500">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors duration-500">
              &copy; {new Date().getFullYear()} ATC Study Hub. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
