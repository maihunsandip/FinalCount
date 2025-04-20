import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { motion } from 'framer-motion';
import { countries } from '../../utils/countries';

const ProfileForm = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    birthdate: '',
    gender: '',
    height: '',
    weight: '',
    nationality: '',
    smoker: false,
    regularExercise: false,
    healthyDiet: false
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        birthdate: user.profile.birthdate?.split('T')[0] || '',
        gender: user.profile.gender || '',
        height: user.profile.height || '',
        weight: user.profile.weight || '',
        nationality: user.profile.country || '',
        smoker: user.profile.lifestyle?.smoker || false,
        regularExercise: user.profile.lifestyle?.regularExercise || false,
        healthyDiet: user.profile.lifestyle?.healthyDiet || false
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert height and weight to numbers and format data for API
      const processedData = {
        birthdate: formData.birthdate,
        gender: formData.gender,
        height: Number(formData.height),
        weight: Number(formData.weight),
        country: formData.nationality,
        lifestyle: {
          smoker: formData.smoker,
          regularExercise: formData.regularExercise,
          healthyDiet: formData.healthyDiet
        }
      };

      console.log('Submitting profile data:', processedData);
      await updateProfile(processedData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Profile update error:', err);
      setError(typeof err === 'string' ? err : err.message || 'Failed to update profile');
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [e.target.name]: value }));
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <motion.div 
        className="max-w-2xl mx-auto p-8 bg-gray-900/50 backdrop-blur-lg border border-gray-800 rounded-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h2 
          className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Your Profile
        </motion.h2>
        {error && (
          <motion.div 
            className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {error}
          </motion.div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="birthdate">
                Birth Date
              </label>
              <input
                type="date"
                id="birthdate"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="nationality">
                Nationality
              </label>
              <select
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-100"
                required
              >
                <option value="">Select Nationality</option>
                {countries.map(country => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="gender">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-100"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="height">
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-100"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2" htmlFor="weight">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-100"
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="smoker"
                name="smoker"
                checked={formData.smoker}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-700 text-orange-500 focus:ring-orange-500 bg-gray-800/50"
              />
              <label className="ml-2 text-gray-300" htmlFor="smoker">
                Smoker
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="regularExercise"
                name="regularExercise"
                checked={formData.regularExercise}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-700 text-orange-500 focus:ring-orange-500 bg-gray-800/50"
              />
              <label className="ml-2 text-gray-300" htmlFor="regularExercise">
                Regular Exercise
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="healthyDiet"
                name="healthyDiet"
                checked={formData.healthyDiet}
                onChange={handleChange}
                className="w-4 h-4 rounded border-gray-700 text-orange-500 focus:ring-orange-500 bg-gray-800/50"
              />
              <label className="ml-2 text-gray-300" htmlFor="healthyDiet">
                Healthy Diet
              </label>
            </div>
          </div>

          <motion.button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-medium rounded-lg hover:from-orange-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Save Profile
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileForm;
