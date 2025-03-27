
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardLayout from "./components/layout/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import CoursesPage from "./pages/dashboard/CoursesPage";
import ExercisesPage from "./pages/dashboard/ExercisesPage";
import TestsPage from "./pages/dashboard/TestsPage";
import ProfilePage from "./pages/dashboard/ProfilePage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageStudentsPage from "./pages/admin/ManageStudentsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route for authenticated users
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Admin Route for admin users only
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/admin-login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner position="top-right" />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin-login" element={<AdminLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected user routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<DashboardHome />} />
              <Route path="courses" element={<CoursesPage />} />
              <Route path="exercises" element={<ExercisesPage />} />
              <Route path="tests" element={<TestsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            
            {/* Protected admin routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <DashboardLayout />
              </AdminRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="students" element={<ManageStudentsPage />} />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
