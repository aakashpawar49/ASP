import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSidebar } from '../context/SidebarContext';

import {
  LayoutDashboard,
  HardDrive,
  Users,
  Ticket,
  FlaskConical,
  Package,
  BookCopy,
  Calendar,
  Settings,
  ChevronDown,
  BarChart3,
  Archive,
  BookUser,
  PieChart
} from 'lucide-react';

// --- Reusable Link Component ---
const SidebarLink = ({ to, icon: Icon, children, isExpanded }) => {
  const location = useLocation();
  // Now also check if the path starts with the 'to' link, for nested routes
  const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));

  return (
    <NavLink
      to={to}
      className={`flex items-center p-3 rounded-lg transition-colors
        ${isExpanded ? 'w-full' : 'w-12 justify-center'}
        ${isActive
          ? 'bg-blue-600 text-white font-medium'
          : 'text-gray-400 hover:text-white hover:bg-gray-700'
        }`}
      title={isExpanded ? '' : children}
    >
      <Icon className="w-5 h-5 shrink-0" />
      {isExpanded && <span className="ml-3 truncate">{children}</span>}
    </NavLink>
  );
};

// --- Reusable Dropdown Component ---
const SidebarDropdown = ({ title, icon: Icon, children, isExpanded }) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  // Check if any child link is active
  const isActive = React.Children.toArray(children).some(
    (child) => child.props.to === location.pathname || location.pathname.startsWith(child.props.to)
  );

  // Open dropdown if a child is active
  React.useEffect(() => {
    if (isActive) {
      setIsOpen(true);
    }
  }, [isActive, location.pathname]);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center p-3 rounded-lg transition-colors w-full
          ${isExpanded ? 'justify-between' : 'w-12 justify-center'}
          ${isActive
            ? 'text-white font-medium'
            : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
        title={isExpanded ? '' : title}
      >
        <div className="flex items-center">
          <Icon className="w-5 h-5 shrink-0" />
          {isExpanded && <span className="ml-3 truncate">{title}</span>}
        </div>
        {isExpanded && (
          <ChevronDown 
            size={16} 
            className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          />
        )}
      </button>
      
      {/* Dropdown Content */}
      {isExpanded && isOpen && (
        <div className="mt-1 ml-6 pl-3 border-l border-gray-700 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
};

// --- Helper for Dropdown Links ---
const DropdownLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <NavLink
      to={to}
      className={`block w-full text-left px-3 py-2 text-sm rounded-md
        ${isActive
          ? 'text-white font-medium'
          : 'text-gray-400 hover:text-white hover:bg-gray-700'
        }`}
    >
      {children}
    </NavLink>
  );
};


// --- Main Sidebar Component ---
const Sidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { user } = useAuth();

  // Helper function to get the dashboard path based on user role
  const getDashboardPath = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'Admin':
        return '/admin/dashboard';
      case 'Student':
        return '/student/dashboard';
      case 'LabTech':
        return '/labtech/dashboard';
      case 'Teacher':
        return '/teacher/dashboard';
      default:
        return '/';
    }
  };

  // This function builds the navigation menu based on user role
  const getNavItems = () => {
    // Default for all logged-in users
    const baseNav = [
      { type: 'link', to: '/profile', icon: BookUser, title: 'My Profile' }
    ];

    // Role-specific navigation
    switch (user?.role) {
      // --- ADMINS see all 10 items ---
      case 'Admin':
        return [
          // --- THIS IS THE CHANGE ---
          { type: 'link', to: '/admin/dashboard', icon: LayoutDashboard, title: 'Dashboard' },
          // --- END OF CHANGE ---

          { type: 'link', to: '/admin/labs', icon: FlaskConical, title: 'Labs Management' },
          { type: 'link', to: '/admin/systems', icon: HardDrive, title: 'Systems / Machines' },
          { type: 'link', to: '/admin/users', icon: Users, title: 'Users Management' },
          { type: 'link', to: '/admin/tickets', icon: Ticket, title: 'Tickets / Issues' },
          { type: 'link', to: '/admin/software', icon: Package, title: 'Software Requests' },
          { type: 'dropdown', title: 'Reports', icon: BarChart3, children: [
            { to: '/admin/reports/usage', title: 'Usage Reports' },
            { to: '/admin/reports/audit', title: 'Audit Trail' },
          ]},
          { type: 'dropdown', title: 'Settings', icon: Settings, children: [
            { to: '/admin/settings/roles', title: 'Roles & Permissions' },
            { to: '/admin/settings/notifications', title: 'Notifications' },
          ]},
        ];

      // --- LABTECH ---
      case 'LabTech':
        return [
          { type: 'link', to: '/labtech/dashboard', icon: LayoutDashboard, title: 'My Dashboard' },
          { type: 'link', to: '/labtech/tickets', icon: Ticket, title: 'My Assigned Tickets' },
          ...baseNav
        ];

      // --- TEACHER ---
      case 'Teacher':
        return [
          { type: 'link', to: '/teacher/dashboard', icon: LayoutDashboard, title: 'My Dashboard' },
          { type: 'link', to: '/teacher/request-software', icon: Package, title: 'Request Software' },
          { type: 'link', to: '/teacher/report-issue', icon: Ticket, title: 'Report an Issue' },
          { type: 'link', to: '/teacher/book-a-lab', icon: Calendar, title: 'Book a Lab' },
          ...baseNav
        ];
      
      // --- STUDENT ---
      case 'Student':
        return [
          { type: 'link', to: '/student/dashboard', icon: LayoutDashboard, title: 'My Dashboard' },
          { type: 'link', to: '/student/request-software', icon: Package, title: 'Request Software' },
          { type: 'link', to: '/student/report-issue', icon: Ticket, title: 'Report an Issue' },
          ...baseNav
        ];

      // Default (if role not found)
      default:
        return baseNav;
    }
  };

  const navItems = getNavItems();
  // We use 'isExpanded' for desktop and 'isMobileOpen' for mobile
  const showText = isExpanded || isMobileOpen || isHovered;

  return (
    <>
      {/* Mobile overlay - shown when mobile menu is open */}
      {isMobileOpen && (
        <div onClick={() => setIsHovered(false)} className="fixed inset-0 bg-black opacity-30 z-40 lg:hidden" />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-gray-900 border-r border-gray-700 z-50
                   flex flex-col transition-all duration-300 ease-in-out
                   ${isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
                   ${isExpanded ? 'w-64' : 'w-20'}
                   ${isHovered && !isExpanded && !isMobileOpen ? 'w-64 shadow-lg' : ''}
                   lg:translate-x-0`} // On desktop, always show it
        onMouseEnter={() => !isMobileOpen && setIsHovered(true)}
        onMouseLeave={() => !isMobileOpen && setIsHovered(false)}
      >
        {/* Logo/Title */}
        <div className={`flex items-center h-16 px-6 border-b border-gray-700 ${!showText && 'justify-center'}`}>
          <Link to={getDashboardPath()} className="flex items-center gap-2">
            {/* Simple Logo Icon */}
            <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-indigo-600 rounded-lg shrink-0" />
            {showText && <span className="font-bold text-xl text-white">LabAdmin</span>}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            if (item.type === 'link') {
              return (
                <SidebarLink key={item.to} to={item.to} icon={item.icon} isExpanded={showText}>
                  {item.title}
                </SidebarLink>
              );
            }
            if (item.type === 'dropdown') {
              return (
                <SidebarDropdown key={item.title} title={item.title} icon={item.icon} isExpanded={showText}>
                  {item.children.map(child => (
                    <DropdownLink key={child.to} to={child.to}>{child.title}</DropdownLink>
                  ))}
                </SidebarDropdown>
              );
            }
            return null;
          })}
        </nav>


      </aside>
    </>
  );
};

export default Sidebar;
