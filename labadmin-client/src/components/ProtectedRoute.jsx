import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import LoadingScreen from './LoadingScreen';

/**
 * A component to protect routes based on user authentication and role.
 * @param {object} props
 * @param {string[]} [props.allowedRoles] - An array of roles allowed to access this route.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // 1. Show a loading screen while the AuthContext is checking for a user
  //    (This prevents a flash of the login page if the user is already logged in)
  if (loading) {
    return <LoadingScreen />;
  }

  // 2. If no user is logged in, redirect them to the login page.
  //    We also save the page they were *trying* to visit, so we can send them back.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If the user is logged in, but their role is NOT in the allowedRoles array...
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // ...redirect them to a "Not Authorized" page (or just back to home).
    // For now, we'll send them to a simple "not-found" page.
    return <Navigate to="/not-found" replace />;
  }

  // 4. If they are logged in AND their role is allowed, show the page.
  //    <Outlet /> renders the child route (e.g., <AdminDashboard />)
  return <Outlet />;
};

export default ProtectedRoute;
