import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import Spinner from '../Spinner';

const LabStatistics = () => {
  const [labData, setLabData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLabStats = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/dashboard/lab-stats');
        setLabData(response.data);
      } catch (error) {
        console.error("Failed to fetch lab stats:", error);
        toast.error("Could not load lab statistics.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLabStats();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full flex items-center justify-center">
        <Spinner text="Loading stats..." />
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full">
      <h3 className="text-xl font-semibold text-white mb-4">Lab Statistics</h3>
      <p className="text-sm text-gray-400 mb-5">Ticket resolution status by lab</p>
      
      <div className="space-y-5">
        {labData.map((lab) => (
          <div key={lab.labId}>
            {/* Header: Lab Name and Percentage */}
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-white">{lab.labName}</span>
              <span className="text-sm font-medium text-gray-400">{lab.percentageOpen}% Open</span>
            </div>
            {/* Sub-text: Open/Total */}
            <p className="text-xs text-gray-500 mb-2">
              {lab.openTickets} Open / {lab.totalTickets} Total
            </p>
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${100 - lab.percentageOpen}%` }} // Show *resolved* percentage
                title={`${100 - lab.percentageOpen}% Resolved`}
              ></div>
            </div>
          </div>
        ))}
        {labData.length === 0 && (
          <p className="text-gray-500 text-center">No lab data found.</p>
        )}
      </div>
    </div>
  );
};

export default LabStatistics;