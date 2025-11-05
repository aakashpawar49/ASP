import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { Check, X } from 'lucide-react';

// Status Tag for the table
const RequestStatus = ({ status }) => {
  const colors = {
    Pending: 'bg-yellow-900 text-yellow-300',
    Approved: 'bg-green-900 text-green-300',
    Rejected: 'bg-red-900 text-red-300',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-700 text-gray-300'}`}>
      {status}
    </span>
  );
};

const SoftwareRequests = () => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('Pending'); // Default to 'Pending'

  // Function to fetch requests from the API
  const fetchRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      // Use the query parameter we built in the API
      const response = await api.get('/softwarerequests', {
        params: { status: filterStatus || null } 
      });
      setRequests(response.data);
    } catch (error) {
      console.error("Failed to fetch requests:", error);
      toast.error("Could not load software requests.");
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]); // Re-fetch when filterStatus changes

  // Fetch requests on component load and when filter changes
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // --- Handler for updating status ---
  const handleUpdateStatus = async (requestId, newStatus) => {
    try {
      // Call the PUT endpoint we tested in Swagger
      await api.put(`/softwarerequests/${requestId}/status`, { status: newStatus });
      toast.success(`Request ${newStatus.toLowerCase()} successfully!`);
      fetchRequests(); // Refresh the table
    } catch (error) {
      console.error(`Failed to ${newStatus.toLowerCase()} request:`, error);
      toast.error(`Could not ${newStatus.toLowerCase()} request.`);
    }
  };

  if (isLoading && requests.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Software Requests</h1>

      {/* Filter Bar */}
      <div className="mb-4">
        <label htmlFor="statusFilter" className="text-sm text-gray-400 mr-2">Filter by status:</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white rounded-md p-2"
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="">All Statuses</option>
        </select>
      </div>

      {/* Requests Table */}
      <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full min-w-max text-left">
          <thead>
            <tr className="text-xs font-semibold text-gray-400 uppercase border-b border-gray-700">
              <th className="p-4">Software</th>
              <th className="p-4">Requester</th>
              <th className="p-4">Lab / Device</th>
              <th className="p-4">Date</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {isLoading ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">No {filterStatus} requests found.</td></tr>
            ) : (
              requests.map((req) => (
                <tr key={req.softwareRequestId} className="text-sm text-gray-300">
                  <td className="p-4">
                    <div className="font-medium text-white">{req.softwareName}</div>
                    <div className="text-xs text-gray-500">Version: {req.version || 'N/A'}</div>
                  </td>
                  <td className="p-4">{req.requesterName || 'N/A'}</td>
                  <td className="p-4">
                    <div className="font-medium text-white">{req.labName}</div>
                    <div className="text-xs text-gray-500">{req.deviceName}</div>
                  </td>
                  <td className="p-4">{new Date(req.createdAt).toLocaleDateString()}</td>
                  <td className="p-4"><RequestStatus status={req.status} /></td>
                  <td className="p-4">
                    {req.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleUpdateStatus(req.softwareRequestId, 'Approved')}
                          className="p-2 text-green-400 hover:text-green-300"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(req.softwareRequestId, 'Rejected')}
                          className="p-2 text-red-500 hover:text-red-400"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
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

export default SoftwareRequests;
