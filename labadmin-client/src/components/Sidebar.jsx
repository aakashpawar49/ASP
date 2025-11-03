import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Settings, LifeBuoy, User, Calendar, Folder } from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center p-3 rounded-lg transition-colors
      ${isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-400 hover:text-white hover:bg-gray-700'
      }`
    }
  >
    <Icon className="w-5 h-5 mr-3" />
    {children}
  </NavLink>
);

// 1. Accept the 'isSidebarOpen' prop
const Sidebar = ({ isSidebarOpen }) => {
  return (
    // 2. Add transition classes and conditional translate-x
    <aside 
      className={`w-64 h-screen bg-gray-900 text-white flex flex-col fixed z-30
                 transition-transform duration-300 ease-in-out
                 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        <Link to="/">LabAdmin</Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</h3>
        <SidebarLink to="/admin/dashboard" icon={LayoutDashboard}>
          Dashboard
        </SidebarLink>
        <SidebarLink to="/admin/analytics" icon={BarChart3}>
          Analytics
        </SidebarLink>
        <SidebarLink to="/admin/calendar" icon={Calendar}>
          Calendar
        </SidebarLink>
        <SidebarLink to="/admin/profile" icon={User}>
          Profile
        </SidebarLink>

        <h3 className="px-3 pt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reports</h3>
        <SidebarLink to="/admin/reports/all" icon={Folder}>
          All Reports
        </SidebarLink>
        
        <h3 className="px-3 pt-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Others</h3>
        <SidebarLink to="/admin/settings" icon={Settings}>
          Settings
        </SidebarLink>
        <SidebarLink to="/admin/help" icon={LifeBuoy}>
          Help Center
        </SidebarLink>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} LabAdmin</p>
      </div>
    </aside>
  );
};

export default Sidebar;