import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-auto">
      <div className="px-6 py-4 text-center">
        <Link to="/" className="text-lg font-bold text-white hover:text-blue-400">
          LabAdmin
        </Link>
        <p className="text-sm text-gray-400 mt-1">
         © 2025 All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;