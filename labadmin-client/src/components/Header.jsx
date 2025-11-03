import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // 1. Import the useAuth hook

const Header = () => {
  // 2. Get the user object and logout function from the context
  const { user, logout } = useAuth();

  // Helper function to get the correct dashboard path based on role
  const getDashboardPath = (role) => {
    switch (role) {
      case 'Admin':
        return '/admin/dashboard';
      case 'LabTech':
        return '/labtech/dashboard';
      case 'Student':
        return '/student/dashboard';
      case 'Teacher':
        return '/teacher/dashboard';
      default:
        return '/';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* Site Logo/Name */}
          <Link to="/" className="text-xl font-bold text-gray-800 hover:text-blue-600">
            LabAdmin
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-600 font-medium hover:text-blue-600 transition-colors"
            >
              Home
            </Link>

            {/* 3. Conditional Rendering */}
            {user ? (
              // --- User is LOGGED IN ---
              <>
                <Link 
                  to={getDashboardPath(user.role)} 
                  className="text-gray-600 font-medium hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </Link>
                
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">
                    Hi, {user.name.split(' ')[0]} {/* Show first name */}
                  </span>
                  <button 
                    onClick={logout} // 4. Add logout button
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              // --- User is LOGGED OUT ---
              <div className="flex items-center space-x-3">
                <Link 
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Register
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;