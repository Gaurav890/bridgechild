import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  GlobeIcon,
  ArrowRightIcon,
  StarIcon,
  CheckCircleIcon,
  PlayIcon,
} from '@heroicons/react/outline';

const LandingPage = () => {
  const features = [
    {
      name: 'Safe & Secure',
      description: 'All interactions are moderated and verified through trusted NGO partners for maximum safety.',
      icon: ShieldCheckIcon,
      color: 'bg-secondary',
    },
    {
      name: 'Global Impact',
      description: 'Connect with children and NGOs worldwide to make a lasting difference across communities.',
      icon: GlobeIcon,
      color: 'bg-primary',
    },
    {
      name: 'Community Driven',
      description: 'Join a compassionate community of sponsors, children, and NGOs working together.',
      icon: UserGroupIcon,
      color: 'bg-accent',
    },
    {
      name: 'Transparent Process',
      description: 'Track your impact with regular updates, photos, and detailed progress reports.',
      icon: HeartIcon,
      color: 'bg-primary',
    },
  ];

  const stats = [
    { id: 1, name: 'Children Supported', value: '2,847+', description: 'Lives transformed' },
    { id: 2, name: 'Verified NGOs', value: '156+', description: 'Trusted partners' },
    { id: 3, name: 'Countries', value: '34+', description: 'Global reach' },
    { id: 4, name: 'Active Sponsors', value: '1,523+', description: 'Caring hearts' },
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Sponsor from Canada',
      content: 'Watching little Maria grow and learn has filled my heart with so much joy. This platform made it incredibly easy to connect and make a real difference.',
      rating: 5,
    },
    {
      name: 'Children\'s Hope Foundation',
      role: 'NGO Partner - Kenya',
      content: 'The transparency and support we receive helps us focus on what matters most - caring for the children. Amazing partnership!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'Sponsor from Singapore',
      content: 'The regular updates and photos bring tears to my eyes. Knowing I\'m helping Ahmed pursue his education dreams is priceless.',
      rating: 5,
    },
  ];

  return (
    <div className="bg-warm overflow-hidden">
      {/* Navigation */}
      <nav className="relative bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-gradient-primary w-10 h-10 rounded-xl flex items-center justify-center">
                <HeartIcon className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-display font-bold text-neutral-dark">
                Helping Hands
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="btn btn-ghost font-medium"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn btn-primary"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-hero overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-white bg-opacity-5 rounded-full transform rotate-12"></div>
          <div className="absolute bottom-0 left-0 -mb-32 -ml-32 w-80 h-80 bg-white bg-opacity-10 rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            {/* Hero Content */}
            <div className="fade-in">
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-display font-bold text-white mb-6 leading-tight">
                Transform Lives,
                <span className="text-primary-200 block">
                  One Child at a Time
                </span>
              </h1>
              <p className="text-xl text-primary-100 mb-8 leading-relaxed max-w-2xl">
                Join our global community of caring individuals making a lasting impact through safe,
                verified child sponsorship programs worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="btn btn-lg bg-white text-primary font-semibold hover:bg-neutral-100 shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Start Sponsoring Today
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
                <button className="btn btn-lg btn-outline border-white text-white hover:bg-white hover:text-primary flex items-center justify-center">
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Watch Our Story
                </button>
              </div>
            </div>

            {/* Hero Image/Illustration */}
            <div className="mt-12 lg:mt-0 slide-up">
              <div className="relative">
                {/* Floating cards */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl transform rotate-3 hover:rotate-6 transition-transform duration-300">
                  <div className="flex items-center space-x-2">
                    <HeartIcon className="h-6 w-6 text-accent-500" />
                    <span className="text-sm font-semibold text-neutral-800">2,847 Lives Changed</span>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-4 bg-white rounded-2xl p-4 shadow-xl transform -rotate-3 hover:-rotate-6 transition-transform duration-300">
                  <div className="flex items-center space-x-2">
                    <GlobeIcon className="h-6 w-6 text-secondary-500" />
                    <span className="text-sm font-semibold text-neutral-800">34 Countries</span>
                  </div>
                </div>

                {/* Main hero visual */}
                <div className="bg-white bg-opacity-10 rounded-3xl p-8 backdrop-blur">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-primary-400 h-32 rounded-2xl opacity-80"></div>
                    <div className="bg-secondary-400 h-32 rounded-2xl opacity-80"></div>
                    <div className="bg-accent-400 h-32 rounded-2xl opacity-80"></div>
                    <div className="bg-primary-300 h-32 rounded-2xl opacity-80"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-dark mb-4">
              Making a Global Impact Together
            </h2>
            <p className="text-xl text-neutral max-w-3xl mx-auto">
              Join thousands of sponsors and hundreds of verified NGOs creating positive change worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className={`text-center transform hover:scale-105 transition-all duration-300 fade-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-gradient-primary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-2xl font-bold text-white">{stat.value.slice(-1)}</span>
                </div>
                <div className="text-3xl sm:text-4xl font-display font-bold text-neutral-dark mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-primary mb-1">{stat.name}</div>
                <div className="text-sm text-neutral">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-neutral py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary-light rounded-full text-primary font-semibold text-sm mb-4">
              Why Choose Helping Hands
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-dark mb-6">
              A Better Way to Make a Difference
            </h2>
            <p className="text-xl text-neutral max-w-3xl mx-auto">
              Our platform ensures safe, transparent, and impactful connections between sponsors and
              children through verified NGO partnerships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className={`card p-8 group cursor-pointer fade-in`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-start space-x-4">
                  <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold text-neutral-dark mb-3">
                      {feature.name}
                    </h3>
                    <p className="text-neutral leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-dark mb-6">
              Stories That Inspire
            </h2>
            <p className="text-xl text-neutral max-w-3xl mx-auto">
              Hear from our community of sponsors and NGO partners who are making a difference
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`card p-8 fade-in`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-primary fill-current" />
                  ))}
                </div>
                <blockquote className="text-neutral-dark mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center">
                  <div className="bg-gradient-primary w-12 h-12 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-neutral-dark font-semibold">{testimonial.name}</div>
                    <div className="text-neutral text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-primary py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Simple steps to start making a meaningful difference in a child's life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Sign Up & Choose Your Role',
                description: 'Join as a Sponsor to support children, as an NGO to help manage programs, or as a Child seeking support.',
              },
              {
                step: '2',
                title: 'Get Matched & Verified',
                description: 'Our system matches sponsors with children based on preferences and needs, all verified through NGO partners.',
              },
              {
                step: '3',
                title: 'Start Making an Impact',
                description: 'Begin your sponsorship journey with secure payments, regular updates, and moderated communication.',
              }
            ].map((step, index) => (
              <div
                key={step.step}
                className={`text-center fade-in`}
                style={{ animationDelay: `${index * 0.3}s` }}
              >
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-2xl font-display font-bold text-primary">{step.step}</span>
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-primary-100 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-warm py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="card-elevated p-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-dark mb-6">
              Ready to Change a Life?
            </h2>
            <p className="text-xl text-neutral mb-8 max-w-2xl mx-auto leading-relaxed">
              Start your journey of making a lasting impact in a child's life through safe,
              verified sponsorship. Every child deserves a chance to thrive.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="btn btn-primary btn-lg shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                Start Sponsoring Now
              </Link>
              <Link
                to="/login"
                className="btn btn-outline btn-lg"
              >
                Sign In to Continue
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-800">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-primary w-10 h-10 rounded-xl flex items-center justify-center">
                  <HeartIcon className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-xl font-display font-bold text-white">
                  Helping Hands
                </span>
              </div>
              <p className="text-neutral-400 leading-relaxed max-w-md">
                Connecting hearts worldwide to create lasting change in children's lives through
                safe, transparent, and impactful sponsorship programs.
              </p>
              <div className="mt-6 flex space-x-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors">
                  <span className="text-white text-sm font-semibold">f</span>
                </div>
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center cursor-pointer hover:bg-secondary-600 transition-colors">
                  <span className="text-white text-sm font-semibold">t</span>
                </div>
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center cursor-pointer hover:bg-accent-600 transition-colors">
                  <span className="text-white text-sm font-semibold">in</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-neutral-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/how-it-works" className="text-neutral-400 hover:text-white transition-colors">How It Works</Link></li>
                <li><Link to="/register" className="text-neutral-400 hover:text-white transition-colors">Get Started</Link></li>
                <li><Link to="/contact" className="text-neutral-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-3">
                <li><Link to="/help" className="text-neutral-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/safety" className="text-neutral-400 hover:text-white transition-colors">Safety</Link></li>
                <li><Link to="/privacy" className="text-neutral-400 hover:text-white transition-colors">Privacy</Link></li>
                <li><Link to="/terms" className="text-neutral-400 hover:text-white transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-neutral-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">
              © 2024 Helping Hands Sponsorship Platform. All rights reserved.
            </p>
            <p className="text-neutral-400 text-sm mt-4 md:mt-0">
              Made with ❤️ for children worldwide
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;