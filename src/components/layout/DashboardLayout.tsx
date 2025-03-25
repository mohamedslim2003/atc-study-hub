
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui-custom/Button';
import { useAuth } from '@/hooks/useAuth';
import { 
  BookOpen, 
  ClipboardList, 
  FileText, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Home 
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const DashboardLayout: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const navItems = [
    {
      title: 'Dashboard',
      href: isAdmin ? '/admin' : '/dashboard',
      icon: <Home className="h-5 w-5" />,
    },
    ...(isAdmin ? [] : [
      {
        title: 'Courses',
        href: '/dashboard/courses',
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        title: 'Exercises',
        href: '/dashboard/exercises',
        icon: <ClipboardList className="h-5 w-5" />,
      },
      {
        title: 'Tests',
        href: '/dashboard/tests',
        icon: <FileText className="h-5 w-5" />,
      },
    ]),
    {
      title: 'Profile',
      href: isAdmin ? '/admin/profile' : '/dashboard/profile',
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-secondary/30">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-white shadow-sm transition-transform duration-300 md:static md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-center h-16 border-b px-4">
          <h1 className="font-bold text-xl text-primary">ATC Study Hub</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-3 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex flex-col flex-1 overflow-y-auto">
          <div className="px-4 py-4">
            <div className="text-sm font-medium text-muted-foreground">
              {isAdmin ? 'Admin Panel' : 'Main Menu'}
            </div>
          </div>
          
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-foreground hover:bg-secondary"
                )}
                end
              >
                <span className="mr-3">{item.icon}</span>
                {item.title}
              </NavLink>
            ))}
          </nav>
          
          <div className="mt-auto p-4">
            <Separator className="my-2" />
            <div className="py-2">
              <div className="text-sm font-medium mb-1">
                {user?.firstName} {user?.lastName}
              </div>
              <div className="text-xs text-muted-foreground mb-3">
                {isAdmin ? 'Administrator' : 'Student'}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                leftIcon={<LogOut className="h-4 w-4" />}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top navigation */}
        <header className="h-16 border-b bg-white shadow-sm z-30 flex items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1 flex justify-end">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </span>
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-medium">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
