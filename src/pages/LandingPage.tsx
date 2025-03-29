
import React, { useEffect } from 'react';
import { Button } from '@/components/ui-custom/Button';
import { Card, CardContent } from '@/components/ui-custom/Card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Shield, LogIn, UserPlus, PlaneLanding } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();
  
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
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1530333821974-f9fcfd640f17?ixlib=rb-4.0.3&auto=format&fit=crop&q=80")',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
        }}
      />
      
      {/* Content Layer */}
      <div className="min-h-screen flex flex-col relative z-10 bg-secondary/60 backdrop-blur-sm">
        {/* Header */}
        <header className="bg-white/90 shadow-sm py-4 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-primary">ATC Study Hub</h1>
          </div>
        </header>
        
        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center p-4 md:p-8">
          <div className="max-w-4xl w-full mx-auto animate-enter">
            <div className="text-center mb-10">
              <h1 className="heading-1 text-gradient mb-4">
                Air Traffic Control Study Hub
              </h1>
              <p className="text-xl text-foreground font-medium max-w-2xl mx-auto">
                Your dedicated learning platform for mastering air traffic control concepts and passing your exams with confidence.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {/* Admin Card */}
              <Card hover glass>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Admin</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Manage courses, exercises, and student progress
                  </p>
                  <Button 
                    variant="primary" 
                    className="w-full"
                    onClick={() => navigate('/admin-login')}
                  >
                    Admin Login
                  </Button>
                </CardContent>
              </Card>
              
              {/* User Card */}
              <Card hover glass>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <LogIn className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">User</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Access your courses, practice exercises, and take tests
                  </p>
                  <Button 
                    variant="primary"
                    className="w-full"
                    leftIcon={<LogIn className="h-4 w-4" />}
                    onClick={() => navigate('/login')}
                  >
                    User Login
                  </Button>
                </CardContent>
              </Card>
              
              {/* Register Card */}
              <Card hover glass>
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <UserPlus className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Register</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    Create a new account to start your ATC learning journey
                  </p>
                  <Button 
                    variant="primary"
                    className="w-full"
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
        <footer className="bg-white/90 py-4 border-t backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ATC Study Hub. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
