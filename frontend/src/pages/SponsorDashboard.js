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
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4 border border-primary-100">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-primary w-8 h-8 rounded-lg flex items-center justify-center shadow-md">
              <HeartIcon className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Welcome Back, Sponsor!
              </h1>
              <p className="text-xs text-neutral-600 font-medium">
                Continue making a difference in children's lives
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={stat.name}
              className="card-elevated p-6 group hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg p-2 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <stat.icon className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <div className="text-right">
                  <div className="text-lg font-display font-bold text-neutral-800 mb-1">{stat.value}</div>
                  <div className="text-xs font-semibold text-primary-600 uppercase tracking-wide">{stat.name}</div>
                </div>
              </div>
              <div className="h-2 bg-gradient-to-r from-primary-200 to-secondary-200 rounded-full"></div>
            </div>
          ))}
        </div>

        <div className="card-elevated p-6">
          <h2 className="text-xl font-display font-bold text-neutral-800 mb-6">Your Impact Journey</h2>
          <div className="bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50 rounded-2xl p-6 border border-primary-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary-200 to-secondary-200 rounded-full opacity-20 transform translate-x-6 -translate-y-6"></div>
            <div className="relative">
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg p-2 shadow-md">
                  <HeartIcon className="h-4 w-4 text-white" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-display font-bold text-neutral-800 mb-2">
                    Ready to Transform Lives?
                  </h3>
                  <p className="text-xs text-neutral-600 mb-3 leading-relaxed">
                    Browse our verified children profiles and start your meaningful sponsorship journey.
                    Every connection creates lasting change.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button className="btn btn-primary px-4 py-1.5 text-xs font-semibold shadow-md">
                      Find Children to Sponsor
                    </button>
                    <button className="btn btn-outline px-4 py-1.5 text-xs font-semibold">
                      Learn How It Works
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card-elevated p-6">
          <h2 className="text-xl font-display font-bold text-neutral-800 mb-6">Recent Activity</h2>
          <div className="text-center py-12">
            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-primary-500" />
            </div>
            <h3 className="text-base font-display font-semibold text-neutral-800 mb-2">Your Journey Begins Here</h3>
            <p className="text-xs text-neutral-600 max-w-md mx-auto leading-relaxed">
              Once you start sponsoring children, you'll see all your meaningful interactions and impact updates here.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SponsorDashboard;