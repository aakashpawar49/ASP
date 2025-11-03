import React from 'react';
// We can add the ThemeToggler later if you have that component
// import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

// This layout provides the gray background and centers the form.
export default function AuthLayout({ children }) {
  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-100">
      <div className="relative flex items-center justify-center w-full min-h-screen px-4">
        <div className="absolute inset-0 pointer-events-none opacity-40" aria-hidden="true">
          <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-blue-200 blur-3xl"></div>
          <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-purple-200 blur-3xl"></div>
        </div>
        {children}
      </div>
      {/* <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
        <ThemeTogglerTwo />
      </div> 
      */}
    </div>
  );
}