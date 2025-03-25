
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui-custom/Button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }
    
    const success = await login(username, password, true);
    if (success) {
      navigate('/admin');
    }
  };

  return (
    <AuthLayout 
      title="Admin Login" 
      subtitle="Enter your admin credentials to access the dashboard"
    >
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield className="h-8 w-8 text-primary" />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Admin username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <Button 
          type="submit" 
          className="w-full" 
          isLoading={loading}
        >
          Login
        </Button>
        
        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Not an administrator?{' '}
            <Button variant="link" className="p-0" onClick={() => navigate('/')}>
              Return to home
            </Button>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default AdminLoginPage;
