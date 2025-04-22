import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// Custom hook for animated counter
const useAnimatedValue = (targetValue, duration = 1500) => {
  const [value, setValue] = useState(0);
  const startTimeRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const startValue = 0;
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = timestamp - startTimeRef.current;
      const percentage = Math.min(progress / duration, 1);
      
      setValue(startValue + (targetValue - startValue) * percentage);
      
      if (progress < duration) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [targetValue, duration]);

  return value;
};

const LifeCountdown = () => {
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(null);
  const [displayUnit, setDisplayUnit] = useState('days');
  const [error, setError] = useState('');
  const [quote, setQuote] = useState('');
  
  // Create animated values for each time unit
  const animatedValues = {
    days: useAnimatedValue(countdown?.daysRemaining || 0, 2000),
    weeks: useAnimatedValue((countdown?.daysRemaining || 0) / 7, 2000),
    months: useAnimatedValue((countdown?.daysRemaining || 0) / 30.44, 2000),
    years: useAnimatedValue((countdown?.daysRemaining || 0) / 365.25, 2000)
  };

  const units = ['days', 'weeks', 'months', 'years'];

  useEffect(() => {
    const fetchLifeExpectancy = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        };
        const res = await axios.get('http://192.168.93.173:3001/api/user/life-expectancy', config);
        setCountdown(res.data);
      } catch (err) {
        setError('Failed to fetch life expectancy data');
      }
    };

    fetchLifeExpectancy();
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const res = await axios.get('https://api.quotable.io/random?tags=inspirational');
      setQuote(res.data.content);
    } catch (err) {
      console.error('Failed to fetch quote');
    }
  };

  const formatNumber = (number) => {
    return Math.round(number).toLocaleString();
  };

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  if (!countdown) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="w-8 h-8 border-t-2 border-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
          Life Countdown
        </h2>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={displayUnit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="text-5xl font-bold mb-6 text-white"
          >
            {formatNumber(animatedValues[displayUnit])}
            <span className="text-2xl ml-2 text-gray-400">{displayUnit}</span>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center sm:gap-2 mb-6 text-sm sm:text-base">
          {units.map(unit => (
            <motion.button
              key={unit}
              onClick={() => setDisplayUnit(unit)}
              className={`px-3 py-1 rounded-full transition-all duration-300 ${
                displayUnit === unit
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white'
                : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {unit.charAt(0).toUpperCase() + unit.slice(1)}
            </motion.button>
          ))}
        </div>

        {quote && (
          <motion.div 
            className="text-center text-gray-400 italic border-t border-gray-800 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            "{quote}"
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default LifeCountdown;
