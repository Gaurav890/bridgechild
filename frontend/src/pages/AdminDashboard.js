import React from 'react';
import {
  UsersIcon,
  OfficeBuildingIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CogIcon,
} from '@heroicons/react/outline';
import DashboardLayout from '../components/layouts/DashboardLayout';

const AdminDashboard = () => {
  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: ChartBarIcon, current: true },
    { name: 'Manage Users', href: '/admin/users', icon: UsersIcon, current: false },
    { name: 'NGO Management', href: '/admin/ngos', icon: OfficeBuildingIcon, current: false },
    { name: 'Children', href: '/admin/children', icon: UserGroupIcon, current: false },
    { name: 'Security', href: '/admin/security', icon: ShieldCheckIcon, current: false },
    { name: 'Settings', href: '/admin/settings', icon: CogIcon, current: false },
  ];

  const stats = [
    { name: 'Total Users', value: '0', icon: UsersIcon, color: 'bg-blue-500' },
    { name: 'Active NGOs', value: '0', icon: OfficeBuildingIcon, color: 'bg-green-500' },
    { name: 'Registered Children', value: '0', icon: UserGroupIcon, color: 'bg-purple-500' },
    { name: 'Active Sponsorships', value: '0', icon: ChartBarIcon, color: 'bg-yellow-500' },
  ];

  return (
    <DashboardLayout navigation={navigation}>
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 border border-primary-100">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-primary w-8 h-8 rounded-lg flex items-center justify-center shadow-md">
              <ShieldCheckIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Admin Control Center
              </h1>
              <p className="text-xs text-neutral-600 font-medium">
                Monitor and manage the Helping Hands platform
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.name}
              className="card-elevated p-6 group hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center">
                <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg p-2 mx-auto mb-2 w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <stat.icon className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <div className="text-lg font-display font-bold text-neutral-800 mb-1">{stat.value}</div>
                <div className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{stat.name}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card-elevated p-6">
            <h2 className="text-xl font-display font-bold text-neutral-800 mb-6">Quick Actions</h2>
            <div className="grid gap-3">
              <button
                type="button"
                className="w-full flex items-center space-x-4 p-4 rounded-xl border border-primary-100 hover:border-primary-300 bg-gradient-to-r from-primary-50 to-secondary-50 hover:from-primary-100 hover:to-secondary-100 transition-all duration-300 group transform hover:scale-[1.02]"
              >
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded p-2 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <UsersIcon className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <span className="text-xs font-semibold text-neutral-800">Manage Users & Accounts</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center space-x-4 p-4 rounded-xl border border-secondary-100 hover:border-secondary-300 bg-gradient-to-r from-secondary-50 to-primary-50 hover:from-secondary-100 hover:to-primary-100 transition-all duration-300 group transform hover:scale-[1.02]"
              >
                <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded p-2 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <OfficeBuildingIcon className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <span className="text-xs font-semibold text-neutral-800">Review NGO Applications</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center space-x-4 p-4 rounded-xl border border-accent-100 hover:border-accent-300 bg-gradient-to-r from-accent-50 to-primary-50 hover:from-accent-100 hover:to-primary-100 transition-all duration-300 group transform hover:scale-[1.02]"
              >
                <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded p-2 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <ShieldCheckIcon className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <span className="text-xs font-semibold text-neutral-800">Security & Safety Settings</span>
              </button>
            </div>
          </div>

          <div className="card-elevated p-6">
            <h2 className="text-xl font-display font-bold text-neutral-800 mb-6">System Status</h2>
            <div className="bg-gradient-to-br from-success-50 via-secondary-50 to-primary-50 rounded-xl p-6 border border-success-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-success-200 to-secondary-200 rounded-full opacity-30 transform translate-x-4 -translate-y-4"></div>
              <div className="relative flex items-start space-x-4">
                <div className="bg-gradient-to-br from-success-500 to-success-600 rounded-lg p-2 shadow-md">
                  <ShieldCheckIcon className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-1 mb-2">
                    <h3 className="text-base font-display font-bold text-success-800">All Systems Operational</h3>
                    <div className="w-1.5 h-1.5 bg-success-500 rounded-full animate-pulse"></div>
                  </div>
                  <p className="text-xs text-success-700 leading-relaxed mb-3">
                    Platform is running smoothly with 99.9% uptime. All security protocols active.
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <div className="text-sm font-bold text-success-800">99.9%</div>
                      <div className="text-xs text-success-600 font-medium">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-success-800">0</div>
                      <div className="text-xs text-success-600 font-medium">Issues</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold text-success-800">Fast</div>
                      <div className="text-xs text-success-600 font-medium">Response</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-elevated p-6">
          <h2 className="text-xl font-display font-bold text-neutral-800 mb-6">Platform Analytics</h2>
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <ChartBarIcon className="h-6 w-6 text-primary-500" />
            </div>
            <h3 className="text-base font-display font-semibold text-neutral-800 mb-2">Analytics Dashboard Coming Soon</h3>
            <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
              Comprehensive platform analytics, user activity, and performance metrics will be available here.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;