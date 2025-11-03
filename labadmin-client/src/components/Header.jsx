import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          
          {/* Site Logo/Name */}
          <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 hover:text-blue-600">
            {/* You could add an icon/logo here */}
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
            
            {/* This is a good place for future links:
              <Link to="/features" className="text-gray-600 font-medium hover:text-blue-600 transition-colors">Features</Link>
              <Link to="/about" className="text-gray-600 font-medium hover:text-blue-600 transition-colors">About</Link>
            */}

            <div className="flex items-center space-x-3">
              <Link 
                to="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Login
              </Link>
              <Link 
                to="/register"
                className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
              >
                Register
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;