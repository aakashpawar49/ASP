import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          
          {/* Logo & Copyright */}
          <div className="text-center md:text-left mb-4 md:mb-0">
            <Link to="/" className="text-lg font-bold text-gray-900 hover:text-blue-600">
              LabAdmin
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          {/* Footer Links */}
          <div className="flex space-x-6">
            <Link to="/about" className="text-sm text-gray-600 hover:text-gray-900">
              About Us
            </Link>
            <Link to="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-600 hover:text-gray-900">
              Terms of Service
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;