import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MenuIcon,
  XIcon,
  HomeIcon,
  UserIcon,
  CogIcon,
  LogoutIcon,
} from '@heroicons/react/outline';
import { useAuth } from '../../contexts/AuthContext';

const DashboardLayout = ({ children, navigation = [] }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const defaultNavigation = [
    { name: 'Dashboard', href: '#', icon: HomeIcon, current: true },
    { name: 'Profile', href: '/profile', icon: UserIcon, current: false },
    { name: 'Settings', href: '/settings', icon: CogIcon, current: false },
  ];

  const nav = navigation.length > 0 ? navigation : defaultNavigation;

  return (
    <div className="h-screen bg-gradient-to-br from-primary-25 via-white to-secondary-25 flex overflow-hidden">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            aria-hidden="true"
            onClick={() => setSidebarOpen(false)}
          ></div>

          <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white/95 backdrop-blur-xl shadow-2xl">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-shrink-0 flex items-center px-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-base">HH</span>
                </div>
                <h2 className="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Helping Hands</h2>
              </div>
            </div>

            <div className="mt-5 flex-1 h-0 overflow-y-auto">
              <nav className="px-2 space-y-1">
                {nav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      item.current
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        item.current ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                      } mr-4 flex-shrink-0 h-6 w-6`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="text-xs font-medium text-gray-500 group-hover:text-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72">
          <div className="flex flex-col flex-grow pt-6 pb-4 overflow-y-auto bg-white/95 backdrop-blur-xl border-r border-primary-100 shadow-xl">
            <div className="flex items-center flex-shrink-0 px-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-base">HH</span>
                </div>
                <h2 className="text-xl font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">Helping Hands</h2>
              </div>
            </div>

            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-4 space-y-2">
                {nav.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`${
                      item.current
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg transform scale-105'
                        : 'text-neutral-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 hover:text-neutral-800'
                    } group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300`}
                  >
                    <item.icon
                      className={`${
                        item.current ? 'text-white' : 'text-neutral-400 group-hover:text-primary-500'
                      } mr-4 flex-shrink-0 h-5 w-5`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex-shrink-0 border-t border-primary-100 p-6">
              <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center p-3 rounded-xl hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-300">
                  <div>
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-lg">
                      <span className="text-white text-lg font-semibold">
                        {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-semibold text-neutral-800">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-neutral-500 font-medium capitalize mb-2">
                      {user?.role} Account
                    </p>
                    <button
                      onClick={handleLogout}
                      className="flex items-center text-xs font-medium text-accent-600 hover:text-accent-700 transition-colors duration-200"
                    >
                      <LogoutIcon className="h-4 w-4 mr-1" />
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-20 bg-white/90 backdrop-blur-lg shadow-lg border-b border-primary-100">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          <div className="flex-1 px-6 flex justify-between items-center">
            <div>
              <h1 className="text-xl font-display font-bold text-neutral-800 capitalize">
                {user?.role} Dashboard
              </h1>
              <p className="text-xs text-neutral-500 font-medium">
                Manage your impact and connections
              </p>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 px-3 py-2 rounded-lg border border-primary-100">
                <span className="text-xs font-medium text-neutral-700">Welcome back, {user?.firstName}! 👋</span>
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gradient-to-br from-neutral-25 to-primary-25">
          <div className="py-8">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;