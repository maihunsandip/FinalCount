import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-circular-progressbar/dist/styles.css';
import LifeCountdown from './LifeCountdown';

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

const Dashboard = () => {
  const { user } = useAuth();
  const [lifeData, setLifeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const animatedValue = useAnimatedValue(lifeData ? parseFloat(lifeData.percentCompleted || 0) : 0);

  useEffect(() => {
    const fetchLifeData = async () => {
      try {
        const config = {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        };
        const res = await axios.get('http://localhost:3001/api/user/life-expectancy', config);
        setLifeData(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching life data:', err);
        setError('Failed to load life expectancy data');
        setLoading(false);
      }
    };

    if (user?.profile?.birthdate) {
      fetchLifeData();
    } else {
      setLoading(false);
      setError('Please complete your profile to see your dashboard.');
    }
  }, [user]);

  if (loading) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-xl text-gray-600">Loading your dashboard...</div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-xl text-gray-600">{error}</div>
      </motion.div>
    );
  }

  if (!user?.profile || !lifeData) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="text-xl text-gray-600">Please complete your profile to see your dashboard.</div>
      </motion.div>
    );
  }

  const profile = user.profile;
  const lifestyle = profile.lifestyle || {};

  return (
    <motion.div 
      className="min-h-screen pt-20 px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Stats */}
          <motion.div 
            className="md:col-span-8 space-y-6"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div 
              className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 p-8 rounded-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">Life Progress</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <LifeCountdown />
                </div>
                <motion.div 
                  className="flex items-center justify-center flex-col"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                >
                  <div className="w-48 h-48 mb-2">
                    {lifeData && (
                      <CircularProgressbar
                        value={animatedValue}
                        text={`${animatedValue.toFixed(1)}%`}
                        styles={buildStyles({
                          textSize: '16px',
                          pathColor: `rgba(255, 120, 0, ${animatedValue / 100})`,
                          textColor: '#f97316',
                          trailColor: 'rgba(255, 255, 255, 0.1)'
                        })}
                      />
                    )}
                  </div>
                  <motion.div 
                    className="text-gray-300 text-sm text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {animatedValue.toFixed(1)}% of life completed
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="md:col-span-4 space-y-6"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {/* Lifestyle Insights */}
            <motion.div 
              className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 p-6 rounded-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">Lifestyle Insights</h2>
              <div className="space-y-4">
                <AnimatePresence>
                  {lifestyle?.regularExercise === false && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl"
                    >
                      <h3 className="font-semibold text-yellow-400">Exercise More</h3>
                      <p className="text-sm text-gray-300">Regular exercise could add 2-3 years to your life expectancy.</p>
                    </motion.div>
                  )}
                  {lifestyle?.smoker && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
                    >
                      <h3 className="font-semibold text-red-400">Quit Smoking</h3>
                      <p className="text-sm text-gray-300">Quitting smoking could add up to 10 years to your life expectancy.</p>
                    </motion.div>
                  )}
                  {!lifestyle?.healthyDiet && (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="p-4 bg-orange-500/10 border border-orange-500/20 rounded-xl"
                    >
                      <h3 className="font-semibold text-orange-400">Improve Diet</h3>
                      <p className="text-sm text-gray-300">A balanced diet can significantly increase your life expectancy.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Milestones */}
            <motion.div 
              className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 p-6 rounded-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">Life Milestones</h2>
              <div className="space-y-4">
                {lifeData && (
                  <>
                    <motion.div 
                      className="relative pl-4 border-l-2 border-orange-500/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <h3 className="font-semibold text-orange-400">5 Years</h3>
                      <p className="text-sm text-gray-300">
                        Age {Math.floor((lifeData.daysLived || 0) / 365) + 5}: Focus on preventive health
                      </p>
                    </motion.div>
                    <motion.div 
                      className="relative pl-4 border-l-2 border-orange-500/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <h3 className="font-semibold text-orange-400">10 Years</h3>
                      <p className="text-sm text-gray-300">
                        Age {Math.floor((lifeData.daysLived || 0) / 365) + 10}: Key health screening decade
                      </p>
                    </motion.div>
                    <motion.div 
                      className="relative pl-4 border-l-2 border-orange-500/50"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <h3 className="font-semibold text-orange-400">Golden Years</h3>
                      <p className="text-sm text-gray-300">
                        Age {Math.floor((lifeData.lifeExpectancy || 80) * 0.75)}: Retirement planning phase
                      </p>
                    </motion.div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
