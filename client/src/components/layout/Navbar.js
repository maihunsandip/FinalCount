import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { UserCircleIcon, ChartBarIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      className={`px-4 py-2 rounded-full transition-all duration-300 ${
        isActive(to)
          ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
          : 'text-gray-300 hover:text-white'
      }`}
    >
      {children}
    </Link>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full top-0 z-50 backdrop-blur-lg bg-gray-900/80 border-b border-gray-800"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-pink-500"
            >
              FinalCount
            </motion.span>
          </Link>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <NavLink to="/dashboard">
                  <div className="flex items-center space-x-2">
                    <ChartBarIcon className="w-5 h-5" />
                    <span>Dashboard</span>
                  </div>
                </NavLink>
                <NavLink to="/profile">
                  <div className="flex items-center space-x-2">
                    <UserCircleIcon className="w-5 h-5" />
                    <span>Profile</span>
                  </div>
                </NavLink>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-full border border-gray-700 text-gray-300 hover:text-white hover:border-orange-500 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
