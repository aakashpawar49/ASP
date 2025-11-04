import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api'; // Your API service
import LoadingScreen from '../components/LoadingScreen'; // Your loading component
import StatCard from '../components/dashboard/StatCard'; // The new stat card widget
import RecentTickets from '../components/dashboard/RecentTickets'; // The new recent tickets widget
import { Ticket, Wrench, Bug, Hourglass } from 'lucide-react'; // Icons for the stat cards

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // This hook runs when the component mounts
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // 1. Call the admin-stats endpoint we tested in Swagger
        const response = await api.get('/dashboard/admin-stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
        toast.error("Could not load dashboard stats.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []); // The empty array means this effect runs only once

  // Show a loading screen while fetching
  if (isLoading || !stats) {
    return <LoadingScreen />;
  }

  // Helper component for the chart placeholders
  const PlaceholderWidget = ({ title, className = "" }) => (
    <div className={`bg-white p-6 rounded-xl shadow-md border border-gray-100 ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="text-gray-400">
        <p>Chart component will go here.</p>
        <p>(Waiting for backend endpoint and 'recharts' integration)</p>
      </div>
    </div>
  );

  return (
    // Main content area
    <div className="text-black">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Overview</h1>

      {/* 2. Renders the 4 StatCards with data from the API */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tickets Raised"
          value={stats.ticketsRaised.toString()}
          icon={<Ticket />}
        />
        <StatCard 
          title="Bugs Fixed"
          value={stats.bugsFixed.toString()}
          icon={<Bug />}
        />
        <StatCard 
          title="Pending Approval"
          value={stats.pendingApproval.toString()}
          icon={<Hourglass />}
        />
        <StatCard 
          title="Systems Under Maintenance"
          value={stats.systemsUnderMaintenance.toString()}
          icon={<Wrench />}
        />
      </div>

      {/* 3. Renders the main dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Placeholders for charts (matching your screenshot) */}
        <PlaceholderWidget 
          title="Monthly Bugs Fixed" 
          className="lg:col-span-2" 
        />
        
        <PlaceholderWidget 
          title="Open vs Closed Tickets" 
          className="lg:row-span-2"
        />

        <PlaceholderWidget 
          title="Technician Performance" 
          className="lg:col-span-2"
        />

        <PlaceholderWidget title="Lab Statistics" />

        {/* 4. Renders the real RecentTickets component */}
        <div className="lg:col-span-2">
          <RecentTickets />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

