import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaShieldAlt, FaExclamationTriangle, FaUserPlus, FaHeart } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useForm } from '../../hooks/useForm';
import {
  required,
  email,
  minLength,
  strongPassword,
  confirmPassword,
} from '../../utils/validation';

const ROLES = [
  { value: 'sponsor', label: 'Sponsor', description: 'Support children through sponsorship' },
  { value: 'ngo', label: 'NGO', description: 'Non-governmental organization' },
  { value: 'child', label: 'Child', description: 'Child seeking sponsorship' },
];

const RegisterForm = ({ onSuccess }) => {
  const { register, error, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    values,
    errors,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm(
    {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      terms: false,
    },
    {
      firstName: [required('First name is required')],
      lastName: [required('Last name is required')],
      email: [required('Email is required'), email()],
      password: [
        required('Password is required'),
        minLength(8, 'Password must be at least 8 characters'),
        strongPassword(),
      ],
      confirmPassword: [
        required('Please confirm your password'),
        confirmPassword(),
      ],
      role: [required('Please select your role')],
      terms: [(value) => value ? '' : 'You must accept the terms and conditions'],
    }
  );

  const onSubmit = async (formData) => {
    const result = await register(formData);
    if (result.success && onSuccess) {
      onSuccess(result.user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white opacity-40"></div>
      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mb-6 shadow-xl ring-4 ring-orange-100">
            <FaHeart className="h-8 w-8 text-white drop-shadow-sm" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Join Our Mission</h2>
          <p className="mt-2 text-sm text-gray-600">
            Create your account to start making a difference
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
          <form className="space-y-6" onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit);
          }}>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <FaExclamationTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  First name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border-2 rounded-xl bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                      errors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="First name"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Last name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`appearance-none block w-full pl-10 pr-3 py-3 border-2 rounded-xl bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                      errors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Last name"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-2 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`appearance-none block w-full pl-10 pr-3 py-3 border-2 rounded-xl bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                I am a
              </label>
              <div className="space-y-2">
                {ROLES.map((role) => (
                  <label
                    key={role.value}
                    className={`relative flex items-center p-4 rounded-xl border cursor-pointer hover:bg-gray-50 transition-all duration-200 ${
                      values.role === role.value
                        ? 'bg-orange-50 border-orange-200 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={values.role === role.value}
                      onChange={handleChange}
                      className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                    />
                    <div className="ml-3">
                      <span className={`text-sm font-medium ${
                        values.role === role.value ? 'text-orange-900' : 'text-gray-900'
                      }`}>
                        {role.label}
                      </span>
                      <p className={`text-sm ${
                        values.role === role.value ? 'text-orange-700' : 'text-gray-500'
                      }`}>
                        {role.description}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
              {errors.role && (
                <p className="mt-2 text-sm text-red-600">{errors.role}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Password Field */}
              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`appearance-none block w-full pl-10 pr-12 py-3 border-2 rounded-xl bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none">
                    <FaShieldAlt className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`appearance-none block w-full pl-10 pr-12 py-3 border-2 rounded-xl bg-white placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 ${
                      errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Password Help */}
            <div className="text-sm text-gray-600">
              Password must be at least 8 characters with at least one letter and one number
            </div>

            {/* Terms Checkbox */}
            <div>
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={values.terms}
                    onChange={(e) => handleChange({ target: { name: 'terms', value: e.target.checked }})}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <span className="text-gray-700">
                    I agree to the{' '}
                    <Link
                      to="/terms"
                      className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link
                      to="/privacy"
                      className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </div>
              </div>
              {errors.terms && (
                <p className="mt-2 text-sm text-red-600">{errors.terms}</p>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={!isValid || isSubmitting || isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin -ml-1 mr-3 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create account'
                )}
              </button>
            </div>

            {/* Sign In Link */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-orange-600 hover:text-orange-500 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;