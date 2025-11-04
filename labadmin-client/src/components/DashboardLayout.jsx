import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
