import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = () => {
  // 1. Add state to manage sidebar visibility. Default to 'true' (open).
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // 2. Create a function to toggle the state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* 3. Pass the state and toggle function down as props.
           The Sidebar is now fixed so it can slide over content.
      */}
      <Sidebar isSidebarOpen={isSidebarOpen} />
      
      {/* 4. The main content area's left margin is now DYNAMIC.
           It changes based on the sidebar's state, with a smooth transition.
      */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
                   ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}
      >
        <Topbar toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
