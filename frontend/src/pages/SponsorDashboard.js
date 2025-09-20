import React from 'react';
import {
  FaUsers,
  FaHeart,
  FaDollarSign,
  FaChartBar,
  FaChild,
  FaHandHoldingHeart,
  FaGift
} from 'react-icons/fa';
import DashboardLayout from '../components/layouts/DashboardLayout';

const SponsorDashboard = () => {
  const navigation = [
    { name: 'Dashboard', href: '/sponsor/dashboard', icon: FaChartBar, current: true },
    { name: 'My Sponsored Children', href: '/sponsor/children', icon: FaUsers, current: false },
    { name: 'Find Children', href: '/sponsor/find-children', icon: FaHeart, current: false },
    { name: 'Donations', href: '/sponsor/donations', icon: FaDollarSign, current: false },
  ];

  const stats = [
    { name: 'Children Sponsored', value: '0', icon: FaChild, color: 'from-orange-400 to-orange-600' },
    { name: 'Total Donations', value: '$0', icon: FaGift, color: 'from-teal-400 to-teal-600' },
    { name: 'Monthly Impact', value: '0', icon: FaHandHoldingHeart, color: 'from-purple-400 to-purple-600' },
  ];

  return (
    <DashboardLayout navigation={navigation}>
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-orange-50 to-teal-50 rounded-xl p-6 border border-orange-100 shadow-lg">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
              <FaHeart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-orange-600 to-teal-600 bg-clip-text text-transparent">
                Welcome Back, Sponsor!
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                Continue making a difference in children's lives around the world
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
                <div className={`bg-gradient-to-br ${stat.color} rounded-xl p-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <stat.icon className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-display font-bold text-gray-800 mb-1">{stat.value}</div>
                  <div className="text-xs font-semibold text-orange-600 uppercase tracking-wide">{stat.name}</div>
                </div>
              </div>
              <div className="h-2 bg-gradient-to-r from-orange-200 to-teal-200 rounded-full mt-2"></div>
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