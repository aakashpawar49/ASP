import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    // This min-h-screen ensures the footer sticks to the bottom, even on short pages
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 text-gray-900">
      <Header />
      
      {/* Outlet renders the current route's component */}
      <main className="flex-grow container mx-auto px-6 py-8 max-w-7xl">
        <Outlet /> 
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;