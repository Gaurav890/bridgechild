import React from 'react';
import {
  AcademicCapIcon,
  HeartIcon,
  PhotographIcon,
  ChatIcon,
} from '@heroicons/react/outline';
import DashboardLayout from '../components/layouts/DashboardLayout';

const ChildDashboard = () => {
  const navigation = [
    { name: 'Dashboard', href: '/child/dashboard', icon: AcademicCapIcon, current: true },
    { name: 'My Profile', href: '/child/profile', icon: PhotographIcon, current: false },
    { name: 'My Sponsor', href: '/child/sponsor', icon: HeartIcon, current: false },
    { name: 'Messages', href: '/child/messages', icon: ChatIcon, current: false },
  ];

  const stats = [
    { name: 'Profile Completeness', value: '75%', icon: PhotographIcon, color: 'bg-blue-500' },
    { name: 'Messages', value: '0', icon: ChatIcon, color: 'bg-green-500' },
    { name: 'Updates Shared', value: '0', icon: AcademicCapIcon, color: 'bg-purple-500' },
  ];

  return (
    <DashboardLayout navigation={navigation}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome to your Dashboard</h2>
          <p className="mt-2 text-gray-600">
            Share your journey and connect with those who care about your future.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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

        <div className="card-elevated">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Complete Your Profile</h3>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-500 rounded-lg p-3">
                <PhotographIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">
                  Make your profile stand out!
                </h4>
                <p className="text-blue-800 mb-4">
                  Complete your profile with photos, stories, and information about your
                  dreams and goals to help sponsors connect with you.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                >
                  Update Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="card-elevated">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Sponsorship Status</h3>
            <div className="text-center py-12">
              <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
                <HeartIcon className="h-12 w-12 text-red-500" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">Looking for a Sponsor</h4>
              <p className="text-gray-600">
                Complete your profile to increase your chances of finding a sponsor.
              </p>
            </div>
          </div>

          <div className="card-elevated">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Messages</h3>
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
                <ChatIcon className="h-12 w-12 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h4>
              <p className="text-gray-600">
                Messages from your sponsor will appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ChildDashboard;