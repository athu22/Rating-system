import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import StoreOwnerDashboard from './pages/StoreOwner/StoreOwnerDashboard';
import UserManagement from './pages/Admin/UserManagement';
import StoreManagement from './pages/Admin/StoreManagement';
import StoreList from './pages/StoreList';
import MyRatings from './pages/MyRatings';
import RatingManagement from './pages/RatingManagement';
import Profile from './pages/Profile';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import LoadingSpinner from './components/UI/LoadingSpinner';

const AppRoutes = () => {
  const { loading, user } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Routes>
      {/* Public routes - always accessible */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      
      {/* Redirect root to login if not authenticated, otherwise to dashboard */}
      <Route 
        path="/" 
        element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />
      
      {/* Protected routes - require authentication */}
      <Route path="/" element={<Layout />}>
        {/* User dashboard */}
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Admin routes */}
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/stores"
          element={
            <ProtectedRoute requiredRole="admin">
              <StoreManagement />
            </ProtectedRoute>
          }
        />
        
        {/* Store owner dashboard */}
        <Route
          path="store-owner/dashboard"
          element={
            <ProtectedRoute requiredRole="store_owner">
              <StoreOwnerDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Store routes */}
        <Route
          path="stores"
          element={
            <ProtectedRoute>
              <StoreList />
            </ProtectedRoute>
          }
        />
        
        {/* Rating routes */}
        <Route
          path="ratings"
          element={
            <ProtectedRoute>
              <RatingManagement />
            </ProtectedRoute>
          }
        />
        
        {/* My Ratings */}
        <Route
          path="my-ratings"
          element={
            <ProtectedRoute>
              <MyRatings />
            </ProtectedRoute>
          }
        />
        
        {/* Profile */}
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Route>
      
      {/* Catch all route - redirect to login if not authenticated */}
      <Route 
        path="*" 
        element={
          user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App; 