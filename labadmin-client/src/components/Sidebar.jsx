import React from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useSidebar } from '../context/SidebarContext';

// Import all the icons we'll need for your 10-point list
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
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={`flex items-center p-3 rounded-lg transition-colors
        ${isExpanded ? 'w-full' : 'w-12 justify-center'}
        ${isActive
          ? 'bg-blue-100 text-blue-600 font-medium'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
    (child) => child.props.to === location.pathname
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
            ? 'text-blue-600 font-medium'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
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
        <div className="mt-1 ml-6 pl-3 border-l border-gray-200 space-y-1">
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
          ? 'text-blue-600 font-medium'
          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
        }`}
    >
      {children}
    </NavLink>
  );
};


// --- Main Sidebar Component ---
const Sidebar = () => {
  const { isExpanded, isMobileOpen } = useSidebar();
  const { user } = useAuth();

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
          { type: 'dropdown', title: 'Dashboard', icon: LayoutDashboard, children: [
            { to: '/admin/dashboard/overview', title: 'Overview' },
            { to: '/admin/dashboard/analytics', title: 'Analytics' },
          ]},
          { type: 'link', to: '/admin/labs', icon: FlaskConical, title: 'Labs Management' },
          { type: 'link', to: '/admin/systems', icon: HardDrive, title: 'Systems / Machines' },
          { type: 'link', to: '/admin/users', icon: Users, title: 'Users Management' },
          { type: 'link', to: '/admin/tickets', icon: Ticket, title: 'Tickets / Issues' },
          { type: 'link', to: '/admin/software', icon: Package, title: 'Software Requests' },
          { type: 'link', to: '/admin/inventory', icon: Archive, title: 'Inventory' },
          { type: 'link', to: '/admin/scheduling', icon: Calendar, title: 'Scheduling' },
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
          { type:link, to: '/labtech/tickets', icon: Ticket, title: 'My Assigned Tickets' },
          { type: 'link', to: '/labtech/inventory', icon: Archive, title: 'Inventory' },
          ...baseNav
        ];

      // --- TEACHER ---
      case 'Teacher':
        return [
          { type: 'link', to: '/teacher/dashboard', icon: LayoutDashboard, title: 'My Dashboard' },
          { type: 'link', to: '/teacher/request-software', icon: Package, title: 'Request Software' },
          { type: 'link', to: '/teacher/report-issue', icon: Ticket, title: 'Report an Issue' },
          { type: 'link', to: '/teacher/schedule', icon: Calendar, title: 'Book a Lab' },
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
  const showText = isExpanded || isMobileOpen;

  return (
    <>
      {/* Mobile overlay - shown when mobile menu is open */}
      {isMobileOpen && (
        <div className="fixed inset-0 bg-black opacity-30 z-40 lg:hidden" />
      )}

      {/* Main Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 z-50
                   flex flex-col transition-all duration-300 ease-in-out
                   ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
                   ${isExpanded ? 'w-64' : 'w-20'}
                   lg:translate-x-0`} // On desktop, always show it (toggle handled by margin)
      >
        {/* Logo/Title */}
        <div className={`flex items-center h-16 px-6 border-b border-gray-200 ${!isExpanded && 'justify-center'}`}>
          <Link to="/" className="flex items-center gap-2">
            {/* Simple Logo Icon */}
            <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-indigo-600 rounded-lg shrink-0" />
            {showText && <span className="font-bold text-xl text-gray-800">LabAdmin</span>}
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

        {/* Sidebar Footer (optional) */}
        <div className={`p-4 border-t border-gray-200 ${!showText && 'hidden'}`}>
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} LabAdmin
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
