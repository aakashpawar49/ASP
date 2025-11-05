import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';

// Colors for the Pie Chart slices
const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const UsageReports = () => {
  const [reportData, setReportData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/reports/usage');
        setReportData(response.data);
      } catch (error) {
        console.error("Failed to fetch usage reports:", error);
        toast.error("Could not load usage reports.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchReportData();
  }, []);

  if (isLoading || !reportData) {
    return <LoadingScreen />;
  }

  const { ticketsResolvedPerLab, topSoftwareRequests } = reportData;

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Usage Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Tickets Resolved Per Lab */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Tickets Resolved Per Lab</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ticketsResolvedPerLab}
                margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                barSize={30}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#00C49F' }}
                  cursor={{ fill: 'rgba(156, 163, 175, 0.1)' }}
                />
                <Bar dataKey="value" fill="#00C49F" radius={[4, 4, 0, 0]} name="Tickets Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Top 5 Software Requests */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Top 5 Software Requests</h3>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topSoftwareRequests}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.name} (${entry.value})`}
                  labelLine={false}
                >
                  {topSoftwareRequests.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }}
                  labelStyle={{ color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsageReports;
