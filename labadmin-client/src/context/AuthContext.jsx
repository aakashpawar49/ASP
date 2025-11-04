import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Import our new API file
import { toast } from 'react-hot-toast'; // Import toast for error messages
import LoadingScreen from '../components/LoadingScreen';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // --- NEW: Check for a token on app load ---
  useEffect(() => {
    // This function runs when the app first loads
    const loadUserFromToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        // We have a token. We need to verify it and get user data.
        // For now, we'll just assume the token is valid
        // In a real app, you'd make an API call here to '/api/auth/me'
        // For this project, we'll just re-login if the email is stored (simple mock)
        console.log("Found token, but can't verify yet.");
      }
      setLoading(false); // Stop loading
    };
    loadUserFromToken();
  }, []);

  /**
   * Logs a user in by calling the API.
   */
  const login = async (email, password) => {
    try {
      // 1. Call the API endpoint
      const response = await api.post('/auth/login', {
        email,
        password
      });

      // 2. We got a successful response (user + token)
      const userData = response.data;

      // 3. Save the user to state
      setUser(userData);

      // 4. Save the token to localStorage
      localStorage.setItem('token', userData.token);

      // 5. Show success and navigate
      toast.success(`Welcome back, ${userData.name}!`);
      
      // Navigate based on role
      if (userData.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (userData.role === 'Teacher') {
        navigate('/teacher/dashboard');
      } else if (userData.role === 'Student') {
        navigate('/student/dashboard');
      } else if (userData.role === 'LabTech') {
        navigate('/labtech/dashboard');
      } else {
        navigate('/'); // Default fallback
      }

    } catch (error) {
      // 5. Handle errors
      console.error("Login failed:", error.response);
      toast.error(error.response?.data || "Invalid email or password.");
    }
  };

  /**
   * Registers a new user by calling the API.
   */
  const register = async (name, email, role, password) => {
    try {
      // 1. Call the API endpoint
      await api.post('/auth/register', {
        name,
        email,
        role,
        password
      });

      // 2. Show success and navigate
      toast.success("Registration successful! Please log in.");
      navigate('/login');

    } catch (error) {
      // 3. Handle errors
      console.error("Registration failed:", error.response);
      toast.error(error.response?.data || "Registration failed.");
    }
  };

  /**
   * Logs a user out.
   */
  const logout = () => {
    console.log('Logging out');
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
    toast.success("Logged out successfully.");
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