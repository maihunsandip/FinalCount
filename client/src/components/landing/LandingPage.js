import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { ChevronRightIcon, ClockIcon, ChartBarIcon, UserCircleIcon } from '@heroicons/react/24/outline';

const FeatureCard = ({ icon: Icon, title, description, delay }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl backdrop-blur-lg border border-gray-700 hover:border-orange-500/50 transition-all duration-300"
    >
      <Icon className="w-12 h-12 text-orange-500 mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

const LandingPage = () => {
  const features = [
    {
      icon: ClockIcon,
      title: "Life Countdown",
      description: "Visualize your journey through time with our intuitive countdown system",
      delay: 0.2
    },
    {
      icon: ChartBarIcon,
      title: "Progress Tracking",
      description: "Monitor your life's progress with dynamic visual representations",
      delay: 0.4
    },
    {
      icon: UserCircleIcon,
      title: "Personal Dashboard",
      description: "Customize your experience with a personalized dashboard",
      delay: 0.6
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500">
            FinalCount
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Discover the value of time through an immersive life tracking experience
          </p>
          <div className="space-x-4">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold hover:from-orange-600 hover:to-pink-600 transition-all duration-300"
            >
              Get Started
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 rounded-full border border-gray-500 text-gray-300 font-semibold hover:border-orange-500 hover:text-orange-500 transition-all duration-300"
            >
              Login
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Experience Time Like Never Before
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-500">
            © {new Date().getFullYear()} FinalCount. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
