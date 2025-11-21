import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import Spinner from '../components/Spinner';
import UpdateTicketModal from '../components/dashboard/UpdateTicketModal';
import { ArrowLeft } from 'lucide-react';

const TicketStatus = ({ status }) => {
  const colors = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    Assigned: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    InProgress: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
      {status}
    </span>
  );
};

const LabTechTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/tickets/my-assigned');
      setTickets(response.data);
    } catch (error) {
      console.error("Failed to fetch assigned tickets:", error);
      toast.error("Could not load assigned tickets.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSuccess = () => {
    fetchTickets(); // Refresh the list after update
  };

  return (
    <div className="text-white p-6">
      {/* Back to Dashboard Link */}
      <div className="mb-6">
        <Link to="/labtech/dashboard" className="flex items-center text-sm text-blue-400 hover:text-blue-300">
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">My Assigned Tickets</h1>

      {/* Tickets Table */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
        {isLoading ? (
          <Spinner text="Loading tickets..." />
        ) : tickets.length === 0 ? (
          <p className="text-gray-400">No assigned tickets found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-left">
              <thead>
                <tr className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                  <th className="py-2 pr-3">Ticket ID</th>
                  <th className="py-2 pr-3">Issue Description</th>
                  <th className="py-2 pr-3">Lab</th>
                  <th className="py-2 pr-3">Requested By</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {tickets.map((ticket) => (
                  <tr key={ticket.ticketId} className="text-sm text-gray-700 dark:text-gray-300">
                    <td className="py-3 pr-3">{ticket.ticketId}</td>
                    <td className="py-3 pr-3">{ticket.issueDescription}</td>
                    <td className="py-3 pr-3">{ticket.device?.lab?.labName || 'N/A'}</td>
                    <td className="py-3 pr-3">{ticket.requester?.name || 'N/A'}</td>
                    <td className="py-3 pr-3">
                      <TicketStatus status={ticket.status} />
                    </td>
                    <td className="py-3 pr-3">
                      <button
                        onClick={() => setSelectedTicket(ticket)}
                        className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {selectedTicket && (
        <UpdateTicketModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default LabTechTickets;
