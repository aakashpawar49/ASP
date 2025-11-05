import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { Link } from 'react-router-dom';

const AuditTrail = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch audit logs
  const fetchAuditTrail = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/reports/audittrail');
      setLogs(response.data);
    } catch (error) {
      console.error("Failed to fetch audit trail:", error);
      toast.error("Could not load audit trail.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch logs on component load
  useEffect(() => {
    fetchAuditTrail();
  }, [fetchAuditTrail]);

  if (isLoading && logs.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Audit Trail Report</h1>

      {/* Audit Log Table */}
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full min-w-max text-left">
          <thead>
            <tr className="text-xs font-semibold text-gray-400 uppercase border-b border-gray-700">
              <th className="p-4">Date / Time</th>
              <th className="p-4">Technician</th>
              <th className="p-4">Action Taken</th>
              <th className="p-4">Related Ticket</th>
              <th className="p-4">Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {isLoading ? (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan="5" className="p-4 text-center text-gray-500">No audit logs found.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.workLogId} className="text-sm text-gray-300">
                  <td className="p-4">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="p-4 font-medium text-white">
                    {log.technicianName || 'N/A'}
                  </td>
                  <td className="p-4">{log.actionTaken}</td>
                  <td className="p-4">
                    <Link 
                      to={`/admin/tickets/${log.ticketId}`} 
                      className="text-blue-400 hover:underline"
                    >
                      Ticket #{log.ticketId}
                    </Link>
                  </td>
                  <td className="p-4 text-gray-400 italic">
                    {log.remarks || 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTrail;
