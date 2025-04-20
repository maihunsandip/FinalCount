import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async (token) => {
    try {
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      const res = await axios.get('http://localhost:3001/api/user/profile', config);
      setUser(res.data);
    } catch (error) {
      localStorage.removeItem('token');
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:3001/api/auth/login', {
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      await loadUser(res.data.token);
      return true;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (email, password) => {
    try {
      const res = await axios.post('http://localhost:3001/api/auth/register', {
        email,
        password
      });
      localStorage.setItem('token', res.data.token);
      await loadUser(res.data.token);
      return true;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (profileData) => {
    try {
      const config = {
        headers: {
          'x-auth-token': localStorage.getItem('token')
        }
      };
      const res = await axios.put('http://localhost:3001/api/user/profile', profileData, config);
      setUser(res.data);
      return true;
    } catch (error) {
      throw error.response?.data?.message || 'Profile update failed';
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      updateProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
