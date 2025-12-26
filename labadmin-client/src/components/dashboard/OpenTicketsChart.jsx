import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import Spinner from '../Spinner';

// Colors for the chart sections
const COLORS = ['#FF8042', '#0088FE']; // Orange (Open), Blue (Closed)

const OpenTicketsChart = () => {
  const [data, setData] = useState([]);
  const [percentage, setPercentage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/dashboard/open-closed-stats');
        const stats = response.data;
        
        // Calculate percentage for the center text
        const open = stats.find(d => d.name === "Open Tickets")?.value || 0;
        const closed = stats.find(d => d.name === "Closed Tickets")?.value || 0;
        const total = open + closed;
        
        setPercentage(total === 0 ? 0 : Math.round((closed / total) * 100));
        setData(stats);

      } catch (error) {
        console.error("Failed to fetch chart data:", error);
        toast.error("Could not load ticket chart data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg h-full flex items-center justify-center">
        <Spinner text="Loading chart..." />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg h-full border border-gray-700" style={{ minHeight: '300px' }}>
      <h3 className="text-xl font-semibold text-white mb-4">Open vs Closed Tickets</h3>
      <p className="text-sm text-gray-400 mb-2">Percentage of tickets resolved this month.</p>

      {/* Container for chart + text overlay */}
      <div className="relative w-full h-64">
        {/* The 75% text in the middle */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-4xl font-bold text-white">{percentage}%</span>
          <span className="text-sm text-green-400">+10% from last month</span>
        </div>

        {/* The Chart */}
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70} // This makes it a donut
              outerRadius={90} //
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#2d3748', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#fff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend at the bottom */}
      <div className="flex justify-center space-x-4 mt-4">
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#FF8042] mr-2"></span>
          <span className="text-sm text-gray-400">Open Tickets: {data.find(d => d.name.includes("Open"))?.value || 0}</span>
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 rounded-full bg-[#0088FE] mr-2"></span>
          <span className="text-sm text-gray-400">Closed Tickets: {data.find(d => d.name.includes("Closed"))?.value || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default OpenTicketsChart;
