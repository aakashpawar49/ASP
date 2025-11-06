import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import UpdateTicketModal from '../components/dashboard/UpdateTicketModal'; // Import the new modal
import { useAuth } from '../hooks/useAuth';

// Reusable Status component
const TicketStatus = ({ status }) => {
  const colors = {
    Assigned: 'bg-blue-900 text-blue-300',
    InProgress: 'bg-indigo-900 text-indigo-300',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-700 text-gray-300'}`}>
      {status}
    </span>
  );
};

const LabTechDashboard = () => {
  const { user } = useAuth();
  const [myTickets, setMyTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to fetch the tech's assigned tickets
  const fetchMyTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      // Call the endpoint we tested in Swagger
      const response = await api.get('/tickets/my-assigned');
      setMyTickets(response.data);
    } catch (error) {
      console.error("Failed to fetch assigned tickets:", error);
      toast.error("Could not load your assigned tickets.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch tickets on component load
  useEffect(() => {
    fetchMyTickets();
  }, [fetchMyTickets]);

  // Handler to open the modal
  const handleOpenModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  // Handler for when update is successful
  const handleUpdateSuccess = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
    fetchMyTickets(); // Refresh the list
  };

  if (isLoading && myTickets.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">My Assigned Tasks</h1>

      {/* Tickets Table */}
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full min-w-max text-left">
          <thead>
            <tr className="text-xs font-semibold text-gray-400 uppercase border-b border-gray-700">
              <th className="p-4">Ticket</th>
              <th className="p-4">Lab / Device</th>
              <th className="p-4">Reported By</th>
              <th className="p-4">Date Assigned</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {isLoading ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : myTickets.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">
                You have no pending tasks. Great job!
              </td></tr>
            ) : (
              myTickets.map((ticket) => (
                <tr key={ticket.ticketId} className="text-sm text-gray-300">
                  <td className="p-4">
                    <div className="font-medium text-white">{ticket.issueDescription}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-white">{ticket.device?.lab?.labName}</div>
                    <div className="text-xs text-gray-500">{ticket.device?.deviceName}</div>
                  </td>
                  <td className="p-4">{ticket.requester?.name || 'N/A'}</td>
                  <td className="p-4">{new Date(ticket.updatedAt).toLocaleDateString()}</td>
                  <td className="p-4"><TicketStatus status={ticket.status} /></td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleOpenModal(ticket)}
                      className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* The Modal (conditionally rendered) */}
      {isModalOpen && (
        <UpdateTicketModal
          ticket={selectedTicket}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default LabTechDashboard;
