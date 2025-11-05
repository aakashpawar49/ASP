import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Your API service
import { toast } from 'react-hot-toast';
import LoadingScreen from '../components/LoadingScreen';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Start as true
  const navigate = useNavigate();

  // --- THIS IS THE CRITICAL FIX ---
  useEffect(() => {
    // This function runs when the app first loads
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        // We have a token. Let's verify it and get the user's data.
        try {
          // Set the token on our api instance (in case this is the first load)
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Call the /api/users/me endpoint we built for the profile page
          const response = await api.get('/users/me');
          
          // We got the user data! Set it in our state.
          setUser(response.data);
          
        } catch (error) {
          // The token was invalid or expired
          console.error("Failed to load user from token:", error);
          localStorage.removeItem('token'); // Clear the bad token
          setUser(null);
        }
      }
      
      // We're done loading, whether we found a user or not
      setLoading(false);
    };

    loadUserFromToken();
  }, []); // The empty array [] means this runs only ONCE on app load

  
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const userData = response.data;
      
      setUser(userData);
      localStorage.setItem('token', userData.token);
      
      // Set the token for all future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
      
      toast.success(`Welcome back, ${userData.name}!`);
      redirectToRoleDashboard(userData.role);

    } catch (error) {
      console.error("Login failed:", error.response);
      toast.error(error.response?.data || "Invalid email or password.");
    }
  };

  const register = async (name, email, role, password) => {
    try {
      await api.post('/auth/register', { name, email, role, password });
      toast.success("Registration successful! Please log in.");
      navigate('/login');
    } catch (error) {
      console.error("Registration failed:", error.response);
      toast.error(error.response?.data || "Registration failed.");
    }
  };

  const logout = () => {
    console.log('Logging out');
    setUser(null);
    localStorage.removeItem('token');
    // Remove the token from the api headers
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
    toast.success("Logged out successfully.");
  };

  // Helper function to redirect
  const redirectToRoleDashboard = (role) => {
    if (role === 'Admin') {
      navigate('/admin/dashboard');
    } else if (role === 'Student') {
      navigate('/student/dashboard');
    } else if (role === 'LabTech') {
      navigate('/labtech/dashboard');
    } else if (role === 'Teacher') {
      navigate('/teacher/dashboard');
    } else {
      navigate('/'); // Default
    }
  };

  // Show a loading screen while we check for a token
  if (loading) {
    return <LoadingScreen />;
  }

  // 3. The value to pass to all children
  const value = {
    user,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
