import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isSidebarOpen }) => {
  return (
    <aside 
      className={`w-64 h-screen bg-gray-900 text-white flex flex-col fixed z-30
                 transition-transform duration-300 ease-in-out
                 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        <Link to="/">LabAdmin</Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {/* Navigation items will go here */}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} LabAdmin</p>
      </div>
    </aside>
  );
};

export default Sidebar;