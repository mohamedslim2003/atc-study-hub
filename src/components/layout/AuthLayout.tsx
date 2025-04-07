
import React from 'react';
import { Card, CardContent } from '@/components/ui-custom/Card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';
import { useTheme } from '@/context/ThemeContext';
import { Toggle } from '@/components/ui/toggle';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backUrl?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showBackButton = true,
  backUrl = '/',
}) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-secondary/30 dark:bg-secondary/10 px-4 py-8 transition-colors duration-500 relative">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
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
      
      <div className="w-full max-w-md animate-enter">
        {showBackButton && (
          <Button
            variant="ghost"
            className="mb-4 transition-colors duration-300"
            onClick={() => navigate(backUrl)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
        )}
        
        <Card className="w-full overflow-hidden transition-all duration-500">
          <CardContent padding="lg">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground dark:text-foreground mb-1 transition-colors duration-500">{title}</h1>
              {subtitle && <p className="text-muted-foreground dark:text-muted-foreground transition-colors duration-500">{subtitle}</p>}
            </div>
            
            {children}
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground dark:text-muted-foreground transition-colors duration-500">
            ATC Study Hub - Learning Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
