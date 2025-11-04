import React from 'react';
import { Link } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';
import { useAuth } from '../hooks/useAuth';
import { Menu, X, Bell, User as UserIcon, LogOut, Settings } from 'lucide-react'; // Added new icons

// --- Placeholder Components ---

// Simple notification bell
const NotificationDropdown = () => (
  <button className="flex items-center justify-center w-10 h-10 text-gray-500 rounded-lg hover:bg-gray-100">
    <Bell size={20} />
  </button>
);

// User profile menu (uses AuthContext) - UPDATED
const UserDropdown = () => {
  const { user, logout } = useAuth();

  return (
    // 'relative' and 'group' are for the hover dropdown
    <div className="relative group">
      {/* This is the always-visible part (the trigger) */}
      <button className="flex items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-100">
        <UserIcon size={28} className="p-1 rounded-full text-gray-600 bg-gray-100" />
        <span className="hidden sm:block text-sm font-medium text-gray-800">{user?.name || 'User'}</span>
      </button>

      {/* This is the hover-activated "Profile Card" */}
      <div 
        className="absolute right-0 top-full mt-1 w-64 p-4
                   bg-white border border-gray-200 rounded-lg shadow-xl
                   opacity-0 invisible group-hover:opacity-100 group-hover:visible
                   transition-all duration-200 ease-in-out
                   transform translate-y-2 group-hover:translate-y-0"
      >
        {/* Card Header: User Info */}
        <div className="flex items-center gap-3">
          <UserIcon size={40} className="p-2 rounded-full text-gray-600 bg-gray-100" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
          </div>
        </div>

        <hr className="my-3 border-gray-200" />

        {/* Card Body: Links */}
        <Link 
          to="/profile" 
          className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
        >
          <UserIcon size={16} className="mr-2" />
          My Profile
        </Link>
        <Link 
          to="/admin/settings" 
          className="flex items-center w-full text-left px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
        >
          <Settings size={16} className="mr-2" />
          Settings
        </Link>
        
        <hr className="my-3 border-gray-200" />

        {/* Card Footer: Logout Button */}
        <button 
          onClick={logout} 
          className="flex items-center w-full text-left px-3 py-2 text-sm text-red-600 rounded-md 
                     font-medium hover:bg-red-50 hover:text-red-700
                     transition-colors"
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};
// --- End of Placeholders ---


const Topbar = () => {
  // Get state and functions from our SidebarContext
  const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

  // Function to decide which toggle to use (desktop or mobile)
  const handleToggle = () => {
    if (window.innerWidth >= 1024) { // 1024px is 'lg' in Tailwind
      toggleSidebar(); // Toggles the 'expanded' state
    } else {
      toggleMobileSidebar(); // Toggles the 'mobileOpen' state
    }
  };

  return (
    // 'sticky top-0' makes it stick to the top
    // Clean, white background with a bottom border
    <header className="sticky top-0 flex w-full bg-white border-b border-gray-200 z-40">
      <div className="flex items-center grow px-4 sm:px-6 h-16">

        {/* Left Section (Toggle) */}
        <div className="flex items-center">
          {/* === Sidebar Toggle Button (Hamburger) === */}
          <button
            type="button"
            className="flex items-center justify-center w-10 h-10 text-gray-500 rounded-lg hover:bg-gray-100 lg:border lg:w-11 lg:h-11"
            onClick={handleToggle}
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Center Section (Logo) */}
        <div className="flex-1 flex justify-center">
          <Link to="/" className="font-bold text-xl text-gray-800">
            LabAdmin
          </Link>
        </div>

        {/* Right Section (Notifications, Profile) */}
        <div className="flex items-center gap-3 sm:gap-4">
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Topbar;