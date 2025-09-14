import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import SponsorDashboard from './pages/SponsorDashboard';
import NGODashboard from './pages/NGODashboard';
import ChildDashboard from './pages/ChildDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Role-Based Routes */}
            <Route
              path="/sponsor/dashboard"
              element={
                <ProtectedRoute requiredRoles={['sponsor']}>
                  <SponsorDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ngo/dashboard"
              element={
                <ProtectedRoute requiredRoles={['ngo']}>
                  <NGODashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/child/dashboard"
              element={
                <ProtectedRoute requiredRoles={['child']}>
                  <ChildDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;