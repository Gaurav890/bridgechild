import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLoginSuccess = (user) => {
    const from = location.state?.from?.pathname || getDashboardPath(user.role);
    navigate(from, { replace: true });
  };

  const getDashboardPath = (role) => {
    switch (role) {
      case 'sponsor':
        return '/sponsor/dashboard';
      case 'ngo':
        return '/ngo/dashboard';
      case 'child':
        return '/child/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/dashboard';
    }
  };

  return <LoginForm onSuccess={handleLoginSuccess} />;
};

export default LoginPage;