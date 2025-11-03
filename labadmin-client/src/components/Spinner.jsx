import React from 'react';

/**
 * Renders a loading spinner.
 * @param {object} props
 * @param {'sm' | 'md' | 'lg'} [props.size='md'] - The size of the spinner.
 * @param {string} [props.text] - Optional text to display below the spinner.
 */
const Spinner = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div 
        // This creates the spinning circle effect
        className={`animate-spin rounded-full border-4 border-solid border-indigo-600 border-t-transparent ${sizeClasses[size] || sizeClasses.md}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <span className="text-lg text-gray-700 animate-pulse">{text}</span>
      )}
    </div>
  );
};

export default Spinner;