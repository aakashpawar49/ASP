import React from 'react';
import { useAuth } from '../hooks/useAuth';
// 1. Import the 'Menu' (sandwich) icon
import { Search, Moon, Bell, User as UserIcon, Menu } from 'lucide-react';

// 2. Accept the 'toggleSidebar' prop
const Topbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 border-b border-gray-700 text-white">
      <div className="flex items-center justify-between h-16 px-6">
        
        <div className="flex items-center space-x-4">
          {/* 3. Add the toggle button */}
          <button 
            onClick={toggleSidebar} 
            className="text-gray-400 hover:text-white"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          {/* Search Bar */}
          <div className="flex items-center bg-gray-700 rounded-md">
            <input
              type="text"
              placeholder="Search or type command..."
              className="bg-transparent pl-4 pr-12 py-2 text-white placeholder-gray-400 focus:outline-none"
            />
            <kbd className="mr-2 text-xs font-medium text-gray-400 border border-gray-500 rounded p-1">⌘K</kbd>
          </div>
        </div>

        {/* User Menu & Icons */}
        <div className="flex items-center space-x-6">
          <button className="text-gray-400 hover:text-white">
            <Moon className="w-5 h-5" />
          </button>
          <button className="text-gray-400 hover:text-white relative">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-2">
            <UserIcon className="w-6 h-6 rounded-full bg-gray-700 p-1" />
            <span className="text-sm font-medium">{user?.name || 'User'}</span>
            <button onClick={logout} className="text-sm text-gray-400 hover:text-white">
              (Logout)
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
