import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  const navigate = useNavigate();

  const handleRegisterSuccess = (user) => {
    const dashboardPath = getDashboardPath(user.role);
    navigate(dashboardPath, { replace: true });
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

  return <RegisterForm onSuccess={handleRegisterSuccess} />;
};

export default RegisterPage;