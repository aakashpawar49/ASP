import React from 'react';

const AdminDashboard = () => {
  
  // Helper component for placeholder widgets
  const Widget = ({ title, children, className = "" }) => (
    <div className={`bg-gray-800 p-6 rounded-lg shadow-lg ${className}`}>
      <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
      <div className="text-gray-300">{children}</div>
    </div>
  );

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* This is the CSS Grid for your widgets */}
      {/* We are matching the layout from your screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top Row: Stat Cards & Donut Chart */}
        <Widget title="Bugs Fixed">Stat Card Placeholder</Widget>
        <Widget title="Tickets Raised">Stat Card Placeholder</Widget>
        <Widget title="Open vs Closed Tickets" className="row-span-2">
          Donut Chart Placeholder
        </Widget>

        {/* Second Row: Bar Chart */}
        <Widget title="Monthly Bugs Fixed" className="lg:col-span-2">
          Bar Chart Placeholder
        </Widget>
        
        {/* Third Row: Area Chart */}
        <Widget title="Technician Performance" className="lg:col-span-3">
          Area Chart Placeholder
        </Widget>

        {/* Fourth Row: Lab Stats & Recent Tickets */}
        <Widget title="Lab Statistics">Lab Stats Placeholder</Widget>
        <Widget title="Recent Tickets" className="lg:col-span-2">
          Recent Tickets List Placeholder
        </Widget>

      </div>
    </div>
  );
};

export default AdminDashboard;
