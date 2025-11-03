import React, { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. Create the Context
const AuthContext = createContext();

// 2. Create the Provider Component
// This component will wrap our entire app and manage the auth state.
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // The logged-in user object
  const navigate = useNavigate();

  // --- MOCK AUTH FUNCTIONS ---
  // We will replace these with real API calls to our ASP.NET backend.

  /**
   * Logs a user in. In a real app, this would call the API.
   * @param {string} email
   * @param {string} password
   */
  const login = (email, password) => {
    console.log('Logging in with:', email, password);

    // --- MOCK LOGIC ---
    // Let's pretend the API returns a user object based on the email.
    let mockUser;
    let redirectTo;

    if (email.includes('admin')) {
      mockUser = { email: email, role: 'Admin', token: 'fake-admin-token' };
      redirectTo = '/admin/dashboard';
    } else if (email.includes('student')) {
      mockUser = { email: email, role: 'Student', token: 'fake-student-token' };
      redirectTo = '/student/dashboard';
    } else if (email.includes('labtech')) {
      mockUser = { email: email, role: 'LabTech', token: 'fake-labtech-token' };
      redirectTo = '/labtech/dashboard';
    } else {
      // Default to teacher for this mock
      mockUser = { email: email, role: 'Teacher', token: 'fake-teacher-token' };
      redirectTo = '/teacher/dashboard';
    }
    
    // Save the user in state
    setUser(mockUser);
    
    // In a real app, you'd save the token to localStorage
    // localStorage.setItem('token', mockUser.token);

    // Redirect to the correct dashboard
    navigate(redirectTo);
  };

  /**
   * Logs a user out.
   */
  const logout = () => {
    console.log('Logging out');
    setUser(null);
    // localStorage.removeItem('token');
    navigate('/login');
  };

  /**
   * Registers a new user. In a real app, this would call the API.
   */
  const register = (name, email, password) => {
    console.log('Registering:', name, email, password);
    
    // --- MOCK LOGIC ---
    // Pretend the API call is successful and redirects to login.
    alert('Registration successful! Please log in.');
    navigate('/login');
  };

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