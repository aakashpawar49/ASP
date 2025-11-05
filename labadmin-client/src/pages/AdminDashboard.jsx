import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import StatCard from '../components/dashboard/StatCard';
import RecentTickets from '../components/dashboard/RecentTickets';
import OpenTicketsChart from '../components/dashboard/OpenTicketsChart';
import MonthlyBugsChart from '../components/dashboard/MonthlyBugsChart';
import LabStatistics from '../components/dashboard/LabStatistics';
import TechPerformanceChart from '../components/dashboard/TechPerformanceChart'; // 1. IMPORT THE FINAL CHART
import { Ticket, Wrench, Bug, Hourglass } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // This hook fetches the data for the 4 stat cards at the top
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        // Calls the /api/dashboard/admin-stats endpoint
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

  // Show a loading screen while fetching the stats
  if (isLoading || !stats) {
    return <LoadingScreen />;
  }
  
  // 2. No more placeholders! We can remove the helper function.

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6 text-white">Overview</h1>

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

      {/* Renders the main dashboard grid, matching your screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        
        {/* Monthly Bugs Fixed Chart (Real) */}
        <div className="lg:col-span-2">
          <MonthlyBugsChart />
        </div>
        
        {/* Open vs Closed Chart (Real) */}
        <div className="lg:row-span-2">
          <OpenTicketsChart />
        </div>
        
        {/* 3. REPLACE THE LAST PLACEHOLDER */}
        <div className="lg:col-span-2">
          <TechPerformanceChart />
        </div>
        
        {/* Lab Statistics (Real) */}
        <div>
          <LabStatistics />
        </div>
        
        {/* Recent Tickets List (Real) */}
        <div className="lg:col-span-2">
          <RecentTickets />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
