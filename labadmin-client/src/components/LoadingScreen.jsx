import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      <div className="relative flex flex-col items-center">
        <div className="h-14 w-14 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-600">Loading...</p>
      </div>
      {/* soft gradient accents */}
      <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden="true">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-indigo-100 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-fuchsia-100 blur-3xl"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;


