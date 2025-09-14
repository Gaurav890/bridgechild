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
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="mt-2 text-gray-600">
            Manage the Helping Hands platform and monitor system performance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className="card-elevated group hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className={`${stat.color} rounded-xl p-3 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-8 w-8 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card-elevated">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <button
                type="button"
                className="w-full flex items-center space-x-4 p-4 rounded-xl border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 group"
              >
                <div className="bg-orange-500 rounded-lg p-3 group-hover:scale-110 transition-transform duration-200">
                  <UsersIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <span className="text-lg font-medium text-gray-900">Manage Users</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center space-x-4 p-4 rounded-xl border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all duration-200 group"
              >
                <div className="bg-teal-500 rounded-lg p-3 group-hover:scale-110 transition-transform duration-200">
                  <OfficeBuildingIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <span className="text-lg font-medium text-gray-900">Review NGO Applications</span>
              </button>

              <button
                type="button"
                className="w-full flex items-center space-x-4 p-4 rounded-xl border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 group"
              >
                <div className="bg-red-500 rounded-lg p-3 group-hover:scale-110 transition-transform duration-200">
                  <ShieldCheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <span className="text-lg font-medium text-gray-900">Security Settings</span>
              </button>
            </div>
          </div>

          <div className="card-elevated">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">System Status</h3>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
              <div className="flex items-start space-x-4">
                <div className="bg-green-500 rounded-lg p-3">
                  <ShieldCheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-green-900 mb-2">All systems operational</h4>
                  <p className="text-green-800">
                    Platform is running smoothly with no reported issues.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-elevated">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
              <ChartBarIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h4>
            <p className="text-gray-600">
              Platform activity and user actions will be displayed here.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;