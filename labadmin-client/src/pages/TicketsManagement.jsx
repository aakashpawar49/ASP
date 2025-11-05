import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import AssignTicketModal from '../components/dashboard/AssignTicketsModal';
import { Link } from 'react-router-dom';

// Reusable Status component
const TicketStatus = ({ status }) => {
  const colors = {
    Pending: 'bg-yellow-900 text-yellow-300',
    Assigned: 'bg-blue-900 text-blue-300',
    InProgress: 'bg-indigo-900 text-indigo-300',
    Completed: 'bg-green-900 text-green-300',
    Rejected: 'bg-red-900 text-red-300',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-700 text-gray-300'}`}>
      {status}
    </span>
  );
};

const TicketsManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(''); // State for the filter
  const [selectedTicket, setSelectedTicket] = useState(null); // Which ticket to assign
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to fetch tickets from the API
  const fetchTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      // Use the query parameter we built in the API
      const response = await api.get('/tickets', {
        params: { status: filterStatus || null } 
      });
      setTickets(response.data);
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      toast.error("Could not load tickets.");
    } finally {
      setIsLoading(false);
    }
  }, [filterStatus]); // Re-fetch when filterStatus changes

  // Fetch tickets on component load and when filter changes
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Handler to open the modal
  const handleOpenAssignModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  // Handler for when assignment is successful
  const handleAssignSuccess = () => {
    toast.success("Ticket list updated!");
    fetchTickets(); // Refresh the table
  };

  if (isLoading && tickets.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Manage Tickets</h1>

      {/* Filter Bar */}
      <div className="mb-4">
        <label htmlFor="statusFilter" className="text-sm text-gray-400 mr-2">Filter by status:</label>
        <select
          id="statusFilter"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-700 border-gray-600 text-white rounded-md p-2"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Assigned">Assigned</option>
          <option value="InProgress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Tickets Table */}
      <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full min-w-max text-left">
          <thead>
            <tr className="text-xs font-semibold text-gray-400 uppercase border-b border-gray-700">
              <th className="p-4">Ticket</th>
              <th className="p-4">Lab / Device</th>
              <th className="p-4">Requested By</th>
              <th className="p-4">Assigned To</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {isLoading ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : tickets.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">No tickets found.</td></tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.ticketId} className="text-sm text-gray-300 hover:bg-gray-700">
                  <td className="p-4">
                    <Link to={`/admin/tickets/${ticket.ticketId}`} className="font-medium text-white hover:underline">
                      {ticket.issueDescription.substring(0, 40)}...
                    </Link>
                    <div className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleString()}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-white">{ticket.device?.lab?.labName}</div>
                    <div className="text-xs text-gray-500">{ticket.device?.deviceName}</div>
                  </td>
                  <td className="p-4">{ticket.requester?.name || 'N/A'}</td>
                  <td className="p-4">{ticket.technician?.name || 'Unassigned'}</td>
                  <td className="p-4"><TicketStatus status={ticket.status} /></td>
                  <td className="p-4">
                    {ticket.status === 'Pending' && (
                      <button 
                        onClick={() => handleOpenAssignModal(ticket)}
                        className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Assign
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* The Modal (conditionally rendered) */}
      {isModalOpen && (
        <AssignTicketModal
          ticket={selectedTicket}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleAssignSuccess}
        />
      )}
    </div>
  );
};

export default TicketsManagement;
