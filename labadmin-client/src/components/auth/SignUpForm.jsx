import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const SignUpForm = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Student');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const { register } = useAuth();

  const handleRegister = (e) => {
    e.preventDefault();
    if (!agreed) {
      alert("You must agree to the Terms and Conditions.");
      return;
    }
    // Updated to send all new fields to the register function
    register(firstName, email, role, password); 
    console.log("Registering:", { firstName, lastName, email, role, password });
  };

  return (
    <div className="w-full max-w-md p-10 space-y-6 bg-gray-900 rounded-xl shadow-2xl border border-gray-700/50">
      {/* Icon */}
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-r from-blue-500 to-indigo-600">
        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      </div>

      {/* Titles */}
      <h2 className="text-center text-2xl font-bold text-white">
        Create Account
      </h2>
      <p className="text-center text-sm text-gray-400">
        Join the Lab Maintenance System
      </p>

      {/* Form */}
      <form onSubmit={handleRegister} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">First Name *</label>
            <input
              type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required
              className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">Last Name *</label>
            <input
              type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required
              className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md shadow-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address *</label>
          <input
            type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md shadow-sm"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-300">Role *</label>
          <select
            id="role" value={role} onChange={(e) => setRole(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md shadow-sm"
          >
            <option>Student</option>
            <option>Teacher</option>
            <option>LabTech</option>
            <option>Admin</option>
          </select>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password *</label>
          <input
            type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            className="mt-1 w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-md shadow-sm"
            placeholder="min 6 characters"
          />
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms" name="terms" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-gray-300">
              By creating an account, you agree to our{' '}
              <Link to="/terms" className="font-medium text-indigo-400 hover:text-indigo-300">Terms and Conditions</Link>
              {' '}and{' '}
              <Link to="/privacy" className="font-medium text-indigo-400 hover:text-indigo-300">Privacy Policy</Link>
            </label>
          </div>
        </div>

        <div>
          <button 
            type="submit" 
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-linear-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Account
          </button>
        </div>
      </form>

      {/* Bottom Link */}
      <p className="text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300">
          Sign in here
        </Link>
      </p>

      {/* Available Roles Box */}
      <div className="rounded-md bg-blue-900/50 border border-blue-700/50 p-4">
        <p className="text-sm font-medium text-blue-300">Available Roles:</p>
        <p className="text-sm text-blue-400">Student, Teacher, Lab Technician, Admin</p>
      </div>
    </div>
  );
};

export default SignUpForm;
