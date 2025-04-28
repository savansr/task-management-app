import { createContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('AuthProvider initializing...');

  // Function to set user data consistently
  const setUserData = (data) => {
    if (data && data._id) {
      // Ensure we have all required user fields
      const userData = {
        _id: data._id,
        name: data.name,
        email: data.email,
        token: data.token
      };
      console.log('Setting user data:', userData);
      setUser(userData);
      setError(null);
    } else {
      console.error('Invalid user data received:', data);
      setUser(null);
      setError('Invalid user data');
    }
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      console.log('Checking if user is logged in...');
      try {
        const token = localStorage.getItem('token');
        console.log('Token from localStorage:', token);
        
        if (!token) {
          console.log('No token found');
          setUser(null);
          setError(null);
          setLoading(false);
          return;
        }

        console.log('Token found, fetching user data...');
        const response = await api.get('/auth/me');
        console.log('Raw response from /auth/me:', response);
        
        if (response.data) {
          setUserData(response.data);
        } else {
          console.error('No data in response:', response);
          localStorage.removeItem('token');
          setUser(null);
          setError('No user data received');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        console.error('Error response:', error.response);
        localStorage.removeItem('token');
        setUser(null);
        setError(error.response?.data?.message || 'Authentication error');
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  // Register user
  const register = async (userData) => {
    console.log('Registering user...');
    try {
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', response);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUserData(response.data);
        return response.data;
      } else {
        throw new Error('Invalid registration response');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  // Login user
  const login = async (userData) => {
    console.log('Logging in user...');
    try {
      const response = await api.post('/auth/login', userData);
      console.log('Login response:', response);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        setUserData(response.data);
        return response.data;
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  // Logout user
  const logout = () => {
    console.log('Logging out user...');
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
  };

  console.log('AuthContext value:', value);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 