import React from 'react';
import {
  UserGroupIcon,
  HeartIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
} from '@heroicons/react/outline';
import DashboardLayout from '../components/layouts/DashboardLayout';

const SponsorDashboard = () => {
  const navigation = [
    { name: 'Dashboard', href: '/sponsor/dashboard', icon: ChartBarIcon, current: true },
    { name: 'My Sponsored Children', href: '/sponsor/children', icon: UserGroupIcon, current: false },
    { name: 'Find Children', href: '/sponsor/find-children', icon: HeartIcon, current: false },
    { name: 'Donations', href: '/sponsor/donations', icon: CurrencyDollarIcon, current: false },
  ];

  const stats = [
    { name: 'Children Sponsored', value: '0', icon: UserGroupIcon, color: 'bg-blue-500' },
    { name: 'Total Donations', value: '$0', icon: CurrencyDollarIcon, color: 'bg-green-500' },
    { name: 'Monthly Impact', value: '0', icon: HeartIcon, color: 'bg-purple-500' },
  ];

  return (
    <DashboardLayout navigation={navigation}>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome to your Sponsor Dashboard</h2>
          <p className="mt-2 text-gray-600">
            Make a difference in children's lives through sponsorship and support.
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
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Getting Started</h3>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
            <div className="flex items-start space-x-4">
              <div className="bg-orange-500 rounded-lg p-3">
                <HeartIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-semibold text-orange-900 mb-2">
                  Start making a difference today!
                </h4>
                <p className="text-orange-800 mb-4">
                  Browse available children who need sponsorship and start your journey
                  of making a positive impact in their lives.
                </p>
                <button
                  type="button"
                  className="btn-primary"
                >
                  Find Children to Sponsor
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card-elevated">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4">
              <UserGroupIcon className="h-12 w-12 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No activity yet</h4>
            <p className="text-gray-600">
              Start sponsoring children to see your positive impact here.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SponsorDashboard;