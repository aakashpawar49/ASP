import React from 'react';

// This layout provides the new dark background and centers the form.
export default function AuthLayout({ children }) {
  return (
    <div className="relative w-full min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* This is the "glass" or "aurora" effect */}
      <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-900 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-900 blur-3xl"></div>
      </div>

      {/* The content (form) is centered on top */}
      <div className="relative flex items-center justify-center w-full min-h-screen p-6 z-10">
        {children}
      </div>
    </div>
  );
}
