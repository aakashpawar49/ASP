import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="w-full">
      
      {/* === 1. Vibrant Hero Section (with Glass Effect) === */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 py-24 px-6 text-white text-center">
        <div className="relative max-w-4xl mx-auto z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Manage Your Labs with Confidence
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-10">
            LabAdmin streamlines bug reports, software requests, and dashboards for every role.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/login" 
              className="px-8 py-3 text-lg font-semibold text-blue-700 bg-white rounded-md hover:bg-gray-100 shadow-sm transition-transform transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link 
              to="/register" 
              className="px-8 py-3 text-lg font-semibold text-white/95 border border-white/30 rounded-md hover:bg-white/10 transition-transform transform hover:scale-105"
            >
              Create an account
            </Link>
          </div>
        </div>
        {/* This is the "glass" or "aurora" effect */}
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white blur-3xl"></div>
        </div>
      </section>

      {/* === 2. A View for Everyone === */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* Consistent brand gradient accents */}
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden="true">
          <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full bg-indigo-100 blur-3xl"></div>
          <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-fuchsia-100 blur-3xl"></div>
        </div>
        <div className="container max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">A View for Everyone</h2>
          <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
            From first-year students to the head admin, everyone gets the tools they need.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          
          <div className="p-6 bg-white rounded-xl shadow-md text-left border border-gray-100 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:ring-2 hover:ring-indigo-200">
            <div className="text-4xl mb-3">🎓</div>
            <h3 className="text-xl font-semibold mb-2">For Students & Teachers</h3>
            <p className="text-gray-600">
              Instantly submit bug reports or software requests. Track the status of your ticket from your personal dashboard.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-md text-left border border-gray-100 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:ring-2 hover:ring-indigo-200">
            <div className="text-4xl mb-3">🔧</div>
            <h3 className="text-xl font-semibold mb-2">For LabTechs</h3>
            <p className="text-gray-600">
              Get a clean, prioritized list of assigned tasks. Update ticket status from "In Progress" to "Completed" with one click.
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md text-left border border-gray-100 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:ring-2 hover:ring-indigo-200">
            <div className="text-4xl mb-3">📊</div>
            <h3 className="text-xl font-semibold mb-2">For Admins</h3>
            <p className="text-gray-600">
              See the health of your labs at a glance. Approve requests, assign tasks, and track resolution times with powerful analytics.
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* === 3. "How It Works" Workflow === */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* Decorative background effects (standardized) */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-28 -left-20 h-80 w-80 rounded-full bg-fuchsia-100 blur-3xl"></div>
          <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-indigo-100 blur-3xl"></div>
          {/* subtle grid overlay */}
          <div className="absolute inset-0 opacity-15 [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]" style={{backgroundImage:"linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)", backgroundSize:"24px 24px"}}></div>
        </div>
        <div className="relative container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">From Report to Resolution</h2>
            <p className="text-lg text-gray-600 mt-2">A simple, transparent 3-step process.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-700 rounded-full mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Submit Request</h3>
              <p className="text-gray-600">A student or teacher finds an issue and submits a bug report or software request.</p>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-700 rounded-full mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Assign & Track</h3>
              <p className="text-gray-600">An Admin reviews the ticket, approves it, and assigns it to an available LabTech.</p>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-700 rounded-full mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Resolve & Notify</h3>
              <p className="text-gray-600">The LabTech resolves the issue, updates the ticket status, and everyone is notified.</p>
            </div>

          </div>
        </div>
      </section>

      {/* === 4. Key Features Grid === */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* subtle corner gradients (standardized) */}
        <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden="true">
          <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-indigo-100 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-64 w-64 -translate-x-1/3 translate-y-1/3 rounded-full bg-fuchsia-100 blur-3xl"></div>
        </div>
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features, Simple Interface</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-md border border-purple-100 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:ring-2 hover:ring-indigo-200">
              <h3 className="text-lg font-semibold mb-2">Device Tracking</h3>
              <p className="text-gray-600">Manage all your assets, from computers and printers to projectors, all in one place.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md border border-purple-100 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:ring-2 hover:ring-indigo-200">
              <h3 className="text-lg font-semibold mb-2">Role-Based Access</h3>
              <p className="text-gray-600">Students, Teachers, LabTechs, and Admins each have unique views and permissions.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md border border-purple-100 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:ring-2 hover:ring-indigo-200">
              <h3 className="text-lg font-semibold mb-2">Status Updates</h3>
              <p className="text-gray-600">Track tickets in real-time, from "Pending" and "Assigned" to "InProgress" and "Completed".</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md border border-purple-100 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:ring-2 hover:ring-indigo-200">
              <h3 className="text-lg font-semibold mb-2">Admin Dashboard</h3>
              <p className="text-gray-600">Visualize key metrics, such as open tickets, resolution times, and common issues.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md border border-purple-100 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:ring-2 hover:ring-indigo-200">
              <h3 className="text-lg font-semibold mb-2">Software Requests</h3>
              <p className="text-gray-600">A dedicated flow for managing and approving new software installations.</p>
            </div>
            <div className="p-6 bg-white rounded-xl shadow-md border border-purple-100 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.25)] hover:ring-2 hover:ring-indigo-200">
              <h3 className="text-lg font-semibold mb-2">Notification System</h3>
              <p className="text-gray-600">Get notified when a task is assigned to you or when your reported issue is resolved.</p>
            </div>
          </div>
        </div>
      </section>

      {/* === 5. Call to Action === */}
      <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white">
        <div className="container max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-extrabold mb-6">
            Ready to Take Control of Your Labs?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Create an account and start streamlining your lab management today.
          </p>
          <Link 
            to="/register" 
            className="px-10 py-4 text-lg font-semibold text-purple-700 bg-white rounded-md hover:bg-gray-100 shadow-lg transition-transform transform hover:scale-105"
          >
            Sign Up for Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;