import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Wrench, BarChart3, HardDrive, Shield, Bell, Package, CheckCircle } from 'lucide-react';

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

      {/* === 2. A View for Everyone (Consistent Icons & Hover) === */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* Consistent brand gradient accents */}
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
          <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full bg-blue-100 blur-3xl"></div>
          <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-purple-100 blur-3xl"></div>
        </div>
        
        <div className="relative container max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">A View for Everyone</h2>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
              From first-year students to the head admin, everyone gets the tools they need.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            
            {/* Card 1 */}
            <div className="p-6 bg-white rounded-xl shadow-md text-left border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Students & Teachers</h3>
              <p className="text-gray-600">
                Instantly submit bug reports or software requests. Track the status of your ticket from your personal dashboard.
              </p>
            </div>
            
            {/* Card 2 */}
            <div className="p-6 bg-white rounded-xl shadow-md text-left border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
                <Wrench size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">For LabTechs</h3>
              <p className="text-gray-600">
                Get a clean, prioritized list of assigned tasks. Update ticket status from "In Progress" to "Completed" with one click.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-white rounded-xl shadow-md text-left border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-lg mb-4">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">For Admins</h3>
              <p className="text-gray-600">
                See the health of your labs at a glance. Approve requests, assign tasks, and track resolution times with powerful analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === 3. "How It Works" Workflow (Consistent & Clean) === */}
      <section className="relative py-20 bg-gray-50 overflow-hidden"> 
        {/* Switched to gray-50 for alternation, removed grid clutter */}
        <div className="relative container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">From Report to Resolution</h2>
            <p className="text-lg text-gray-600 mt-2">A simple, transparent 3-step process.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-700 rounded-full mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-semibold mb-2">Submit Request</h3>
              <p className="text-gray-600">A student or teacher finds an issue and submits a bug report or software request.</p>
            </div>
            
            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-700 rounded-full mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-semibold mb-2">Assign & Track</h3>
              <p className="text-gray-600">An Admin reviews the ticket, approves it, and assigns it to an available LabTech.</p>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-700 rounded-full mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="text-xl font-semibold mb-2">Resolve & Notify</h3>
              <p className="text-gray-600">The LabTech resolves the issue, updates the ticket status, and everyone is notified.</p>
            </div>

          </div>
        </div>
      </section>

      {/* === 4. Key Features Grid (Consistent Icons & Hover) === */}
      <section className="relative py-20 bg-white overflow-hidden">
        {/* Consistent brand gradient accents */}
        <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden="true">
          <div className="absolute top-0 right-0 h-80 w-80 translate-x-1/3 -translate-y-1/3 rounded-full bg-blue-100 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-80 w-80 -translate-x-1/3 translate-y-1/3 rounded-full bg-purple-100 blur-3xl"></div>
        </div>

        <div className="relative container max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features, Simple Interface</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={<HardDrive size={20} />} title="Device Tracking">
              Manage all your assets, from computers and printers to projectors, all in one place.
            </FeatureCard>
            <FeatureCard icon={<Shield size={20} />} title="Role-Based Access">
              Students, Teachers, LabTechs, and Admins each have unique views and permissions.
            </FeatureCard>
            <FeatureCard icon={<CheckCircle size={20} />} title="Status Updates">
              Track tickets in real-time, from "Pending" and "Assigned" to "InProgress" and "Completed".
            </FeatureCard>
            <FeatureCard icon={<BarChart3 size={20} />} title="Admin Dashboard">
              Visualize key metrics, such as open tickets, resolution times, and common issues.
            </FeatureCard>
            <FeatureCard icon={<Package size={20} />} title="Software Requests">
              A dedicated flow for managing and approving new software installations.
            </FeatureCard>
            <FeatureCard icon={<Bell size={20} />} title="Notification System">
              Get notified when a task is assigned to you or when your reported issue is resolved.
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* === 5. Call to Action (Consistent Gradients) === */}
      <section className="relative overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-purple-600 text-white">
        {/* This is the "glass" or "aurora" effect */}
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden="true">
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white blur-3xl"></div>
        </div>

        <div className="relative container max-w-4xl mx-auto px-6 py-20 text-center z-10">
          <h2 className="text-4xl font-extrabold mb-6">
            Ready to Take Control of Your Labs?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Create an account and start streamlining your lab management today.
          </p>
          <Link 
            to="/register" 
            className="px-10 py-4 text-lg font-semibold text-blue-700 bg-white rounded-md hover:bg-gray-100 shadow-lg transition-transform transform hover:scale-105"
          >
            Sign Up for Free
          </Link>
        </div>
      </section>
    </div>
  );
};

// Helper component for the feature cards
const FeatureCard = ({ icon, title, children }) => {
  return (
    <div className="flex items-start p-6 bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="shrink-0 flex items-center justify-center w-10 h-10 bg-purple-100 text-purple-600 rounded-lg mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{children}</p>
      </div>
    </div>
  );
};

export default HomePage;