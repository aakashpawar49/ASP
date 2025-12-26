import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import Spinner from '../Spinner';

const MonthlyBugsChart = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/dashboard/monthly-bugs');
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch monthly bugs data:", error);
        toast.error("Could not load monthly bugs chart.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchChartData();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg h-full flex items-center justify-center" style={{ minHeight: '300px' }}>
        <Spinner text="Loading chart..." />
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg h-full border border-gray-700" style={{ minHeight: '300px' }}>
      <h3 className="text-xl font-semibold text-white mb-4">Monthly Bugs Fixed</h3>
      <div style={{ width: '100%', height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 20,
              left: -10, // Adjust left margin to pull Y-axis labels closer
              bottom: 5,
            }}
            barSize={20}
          >
            {/* Grid background */}
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" vertical={false} />
            
            {/* X-axis (Months) */}
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF" // gray-400
              fontSize={12} 
              tickLine={false} 
              axisLine={false} 
            />
            
            {/* Y-axis (Count) */}
            <YAxis 
              stroke="#9CA3AF" // gray-400
              fontSize={12} 
              tickLine={false} 
              axisLine={false}
              allowDecimals={false} // Ensure only whole numbers
            />
            
            {/* Tooltip on hover */}
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} // bg-gray-800
              labelStyle={{ color: '#fff' }}
              itemStyle={{ color: '#0088FE' }}
              cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }} // gray-400 with opacity
            />
            
            {/* The actual bars */}
            <Bar dataKey="value" fill="#0088FE" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyBugsChart;
