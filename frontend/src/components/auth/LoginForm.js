import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, EyeOffIcon, HeartIcon } from '@heroicons/react/outline';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import { required, email } from '../../utils/validation';

const LoginForm = ({ onSuccess }) => {
  const { login, error, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(
    { email: '', password: '' },
    {
      email: [required('Email is required'), email()],
      password: [required('Password is required')],
    }
  );

  const onSubmit = async (formData) => {
    const result = await login(formData.email, formData.password);
    if (result.success && onSuccess) {
      onSuccess(result.user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-secondary-50 to-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card-elevated p-10 backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="bg-gradient-primary w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg">
              <HeartIcon className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
              Welcome Back
            </h1>
            <p className="text-sm text-neutral-600 font-medium">
              Sign in to continue making a difference
            </p>
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit);
            }}
          >
            {error && (
              <div className="rounded-md bg-error-50 border border-error-200 p-4">
                <div className="text-sm text-error-700">{error}</div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={errors.email ? 'input-error' : 'input'}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error-600">{errors.email}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`${errors.password ? 'input-error' : 'input'} pr-10`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 top-6 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4 text-secondary-400 hover:text-secondary-600" />
                  ) : (
                    <EyeIcon className="h-4 w-4 text-secondary-400 hover:text-secondary-600" />
                  )}
                </button>
                {errors.password && (
                  <p className="mt-1 text-sm text-error-600">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link
                to="/forgot-password"
                className="text-xs text-primary-600 hover:text-primary-500"
              >
                Forgot your password?
              </Link>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="btn btn-primary w-full py-3 text-sm font-semibold shadow-lg transform hover:scale-[1.02] transition-all duration-300"
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In to Continue'
                )}
              </button>
            </div>

            <div className="text-center">
              <span className="text-xs text-secondary-600">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Sign up here
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;