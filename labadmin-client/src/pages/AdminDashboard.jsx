import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import StatCard from '../components/dashboard/StatCard';
import RecentTickets from '../components/dashboard/RecentTickets';
import OpenTicketsChart from '../components/dashboard/OpenTicketsChart';
import MonthlyBugsChart from '../components/dashboard/MonthlyBugsChart'; // We've added this
import { Ticket, Wrench, Bug, Hourglass } from 'lucide-react'; // Icons for the stat cards

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // This hook fetches the data for the 4 stat cards
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
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

  // Helper component for the chart placeholders we haven't built yet
  const PlaceholderWidget = ({ title, className = "" }) => (
    <div className={`bg-gray-800 p-6 rounded-xl shadow-lg ${className}`}>
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <div className="text-gray-400">
        <p>Chart component will go here.</p>
        <p>(Waiting for backend endpoint and 'recharts' integration)</p>
      </div>
    </div>
  );

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Overview</h1>

      {/* Renders the 4 StatCards with data from the API */}
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

      {/* Renders the main dashboard grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Monthly Bugs Fixed Chart (Real) */}
        <div className="lg:col-span-2">
          <MonthlyBugsChart />
        </div>
        
        {/* Open vs Closed Chart (Real) */}
        <div className="lg:row-span-2">
          <OpenTicketsChart />
        </div>
        
        {/* Technician Performance (Placeholder) */}
        <PlaceholderWidget 
          title="Technician Performance" 
          className="lg:col-span-2"
        />
        
        {/* Lab Statistics (Placeholder) */}
        <PlaceholderWidget title="Lab Statistics" />
        
        {/* Recent Tickets List (Real) */}
        <div className="lg:col-span-2">
          <RecentTickets />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;