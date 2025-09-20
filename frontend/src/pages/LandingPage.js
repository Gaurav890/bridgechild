import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaHeart,
  FaUsers,
  FaShieldAlt,
  FaGlobe,
  FaArrowRight,
  FaStar,
  FaCheckCircle,
  FaPlay,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn
} from 'react-icons/fa';

const LandingPage = () => {
  const features = [
    {
      name: 'Safe & Secure',
      description: 'All interactions are moderated and verified through trusted NGO partners for maximum safety.',
      icon: FaShieldAlt,
      color: 'bg-secondary',
    },
    {
      name: 'Global Impact',
      description: 'Connect with children and NGOs worldwide to make a lasting difference across communities.',
      icon: FaGlobe,
      color: 'bg-primary',
    },
    {
      name: 'Community Driven',
      description: 'Join a compassionate community of sponsors, children, and NGOs working together.',
      icon: FaUsers,
      color: 'bg-accent',
    },
    {
      name: 'Transparent Process',
      description: 'Track your impact with regular updates, photos, and detailed progress reports.',
      icon: FaHeart,
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
              <div className="bg-gradient-primary w-8 h-8 rounded-lg flex items-center justify-center">
                <FaHeart className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-base font-display font-bold text-neutral-dark">
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
      <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-orange-600 to-orange-800">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
        <div style={{position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '80px 16px', width: '100%', zIndex: 10}}>
          <div style={{textAlign: 'center'}}>
            {/* Trust Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '8px 16px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '9999px',
              color: 'white',
              fontWeight: '500',
              fontSize: '14px',
              marginBottom: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <FaHeart style={{height: '16px', width: '16px', marginRight: '8px'}} />
              Trusted by 2,847+ sponsors worldwide
            </div>

            {/* Main Title */}
            <h1 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: '32px',
              lineHeight: '1.2',
              maxWidth: '800px',
              margin: '0 auto 32px auto'
            }}>
              Transform Lives,
              <span style={{display: 'block', color: '#fed7aa'}}>
                One Child at a Time
              </span>
            </h1>

            {/* Description */}
            <p style={{
              fontSize: '20px',
              color: '#fed7aa',
              marginBottom: '48px',
              lineHeight: '1.6',
              maxWidth: '600px',
              margin: '0 auto 48px auto'
            }}>
              Join our global community of caring individuals making a lasting impact through safe,
              verified child sponsorship programs worldwide.
            </p>

            {/* CTA Buttons */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '16px', justifyContent: 'center', alignItems: 'center'}}>
              <Link
                to="/register"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '16px 32px',
                  backgroundColor: 'white',
                  color: '#ea580c',
                  fontWeight: '600',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '18px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                Start Sponsoring Today
                <FaArrowRight style={{marginLeft: '8px', height: '20px', width: '20px'}} />
              </Link>
              <button style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '16px 32px',
                border: '2px solid white',
                backgroundColor: 'transparent',
                color: 'white',
                fontWeight: '600',
                borderRadius: '8px',
                fontSize: '18px',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                <FaPlay style={{height: '20px', width: '20px', marginRight: '8px'}} />
                Watch Our Story
              </button>
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
      <section className="bg-gradient-to-br from-gray-50 to-white py-24 relative">
        <div className="absolute inset-0 bg-orange-50 opacity-30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
                className={`card p-8 group cursor-pointer fade-in hover:shadow-xl transition-all duration-300`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-start space-x-6">
                  <div className={`${feature.color} w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold text-neutral-dark mb-3">
                      {feature.name}
                    </h3>
                    <p className="text-neutral text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))})
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
                className={`card p-8 fade-in hover:shadow-xl transition-all duration-300`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="h-4 w-4 text-primary" />
                  ))}
                </div>
                <blockquote className="text-neutral-dark mb-6 text-base leading-relaxed italic">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center">
                  <div className="bg-gradient-primary w-10 h-10 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-3">
                    <div className="text-neutral-dark font-medium text-sm">{testimonial.name}</div>
                    <div className="text-neutral text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-to-br from-teal-600 to-teal-800 py-24 relative">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
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
                  <span className="text-2xl font-display font-bold text-teal-600">{step.step}</span>
                </div>
                <h3 className="text-xl font-display font-semibold text-white mb-4">
                  {step.title}
                </h3>
                <p className="text-teal-100 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-orange-100 to-teal-100 py-20 relative">
        <div className="absolute inset-0 bg-white opacity-60"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
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
                <FaCheckCircle className="h-5 w-5 mr-2" />
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
      <footer className="bg-gradient-to-br from-gray-900 to-black">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-primary w-10 h-10 rounded-xl flex items-center justify-center">
                  <FaHeart className="h-6 w-6 text-white" />
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
                  <FaFacebookF className="text-white text-sm" />
                </div>
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center cursor-pointer hover:bg-secondary-600 transition-colors">
                  <FaTwitter className="text-white text-sm" />
                </div>
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center cursor-pointer hover:bg-accent-600 transition-colors">
                  <FaLinkedinIn className="text-white text-sm" />
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