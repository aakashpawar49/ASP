import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import Spinner from '../Spinner';

// Generate dynamic colors for the techs
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const TechPerformanceChart = () => {
  const [data, setData] = useState([]);
  const [techNames, setTechNames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/dashboard/tech-performance');
        const chartData = response.data;

        if (chartData.length > 0) {
          // Get the keys from the first object (e.g., "month", "John Doe", "Alice Smith")
          // and filter out "month" to get just the tech names.
          const names = Object.keys(chartData[0]).filter(key => key !== 'month');
          setTechNames(names);
        }
        
        setData(chartData);

      } catch (error) {
        console.error("Failed to fetch tech performance data:", error);
        toast.error("Could not load technician performance chart.");
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
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg h-full border border-gray-700" style={{ minHeight: '350px' }}>
      <h3 className="text-xl font-semibold text-white mb-4">Technician Performance</h3>
      <p className="text-sm text-gray-400 mb-4">Monthly tickets resolved by technicians</p>

      <div style={{ width: '100%', height: '350px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" vertical={false} />
            <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
            />
            {/* The legend at the bottom */}
            <Legend wrapperStyle={{ color: '#fff' }} />
            
            {/* Dynamically create an <Area> for each technician */}
            {techNames.map((name, index) => (
              <Area
                key={name}
                type="monotone"
                dataKey={name}
                stroke={COLORS[index % COLORS.length]}
                fillOpacity={0.3}
                fill={COLORS[index % COLORS.length]}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TechPerformanceChart;
