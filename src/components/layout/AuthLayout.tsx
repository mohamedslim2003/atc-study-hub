
import React from 'react';
import { Card, CardContent } from '@/components/ui-custom/Card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui-custom/Button';

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

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-secondary/30 px-4 py-8">
      <div className="w-full max-w-md animate-enter">
        {showBackButton && (
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate(backUrl)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
        )}
        
        <Card className="w-full overflow-hidden">
          <CardContent padding="lg">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
              {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
            </div>
            
            {children}
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            ATC Study Hub - Learning Management System
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
