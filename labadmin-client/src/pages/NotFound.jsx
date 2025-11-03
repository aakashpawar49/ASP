import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    // We set a white background and make it relative for the pattern
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-white text-center px-6 overflow-hidden">
      
      {/* This is the subtle gradient "pattern" in the background.
        It matches the "glass effect" from your hero page.
      */}
      <div className="absolute inset-0 z-0 opacity-15" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-600 to-blue-600 blur-3xl"></div>
      </div>

      {/* All content is placed in a z-10 container to sit on top 
        of the background pattern.
      */}
      <div className="w-full max-w-md z-10">
        
        {/* The 404 Error Code with Gradient Text */}
        <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600">
          404
        </h1>
        
        {/* Title */}
        <h2 className="mt-4 text-3xl font-bold text-gray-900">
          Page Not Found
        </h2>
        
        {/* Message */}
        <p className="mt-4 text-lg text-gray-600">
          Sorry, we couldn’t find the page you’re looking for. It might have been moved, deleted, or you might have mistyped the URL.
        </p>
        
        {/* Back to Home Button (already has the gradient) */}
        <div className="mt-10">
          <Link 
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg className="mr-3 -ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;