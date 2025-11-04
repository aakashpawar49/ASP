import React, { createContext, useContext, useState } from 'react';

// Create the context
const SidebarContext = createContext();

// Create the provider component
export const SidebarProvider = ({ children }) => {
  // State for desktop sidebar (expanded or collapsed)
  const [isExpanded, setIsExpanded] = useState(true);
  // State for mobile sidebar (open or closed)
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // State for hover (when sidebar is collapsed)
  const [isHovered, setIsHovered] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const value = {
    isExpanded,
    setIsExpanded,
    toggleSidebar,
    isMobileOpen,
    setIsMobileOpen,
    toggleMobileSidebar,
    isHovered,
    setIsHovered,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};

// Create the custom hook
export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
};
