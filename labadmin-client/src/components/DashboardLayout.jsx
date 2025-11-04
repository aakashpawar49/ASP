import React from 'react';
import { Outlet } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import { useSidebar } from '../context/SidebarContext';

const DashboardLayout = () => {
  const { isExpanded } = useSidebar();

  return (
    <div className={`min-h-screen bg-gray-50 ${isExpanded ? 'lg:ml-64' : 'lg:ml-20'}`}>
      <Sidebar />
      <Topbar />
      <main className="container mx-auto px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
