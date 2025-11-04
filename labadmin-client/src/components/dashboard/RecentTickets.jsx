import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../services/api'; // Our API service
import Spinner from '../Spinner'; // Our loading spinner

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

const RecentTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        // Call the endpoint we just tested in Swagger
        const response = await api.get('/tickets/recent');
        setTickets(response.data);
      } catch (error) {
        console.error("Failed to fetch recent tickets:", error);
        toast.error("Could not load recent tickets.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (isLoading) {
    return <Spinner text="Loading tickets..." />;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Tickets</h3>
        <Link to="/admin/tickets" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          See all
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max text-left">
          <thead>
            <tr className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
              <th className="py-2 pr-3">Ticket</th>
              <th className="py-2 pr-3">Lab</th>
              <th className="py-2 pr-3">Requested By</th>
              <th className="py-2 pr-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tickets.map((ticket) => (
              <tr key={ticket.ticketId} className="text-sm text-gray-700 dark:text-gray-300">
                <td className="py-3 pr-3">
                  <Link to={`/admin/tickets/${ticket.ticketId}`} className="font-medium text-gray-900 hover:underline dark:text-white">
                    {ticket.issueDescription.substring(0, 30)}...
                  </Link>
                </td>
                <td className="py-3 pr-3">{ticket.device?.lab?.labName || 'N/A'}</td>
                <td className="py-3 pr-3">{ticket.requester?.name || 'N/A'}</td>
                <td className="py-3 pr-3">
                  <TicketStatus status={ticket.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTickets;
