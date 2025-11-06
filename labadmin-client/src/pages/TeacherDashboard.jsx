import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Plus, Calendar } from 'lucide-react'; // Added Calendar icon

// Reusable Status component
const RequestStatus = ({ status }) => {
  const colors = {
    Pending: 'bg-yellow-900 text-yellow-300',
    Assigned: 'bg-blue-900 text-blue-300',
    InProgress: 'bg-indigo-900 text-indigo-300',
    Approved: 'bg-green-900 text-green-300',
    Completed: 'bg-green-900 text-green-300',
    Rejected: 'bg-red-900 text-red-300',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-700 text-gray-300'}`}>
      {status}
    </span>
  );
};

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [myTickets, setMyTickets] = useState([]);
  const [mySoftware, setMySoftware] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyData = async () => {
      try {
        setIsLoading(true);
        // We use the exact same endpoints as the student
        const ticketPromise = api.get('/tickets/my-requests');
        const softwarePromise = api.get('/softwarerequests/my-requests');
        
        const [ticketResponse, softwareResponse] = await Promise.all([
          ticketPromise,
          softwarePromise
        ]);

        setMyTickets(ticketResponse.data);
        setMySoftware(softwareResponse.data);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        toast.error("Could not load your data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyData();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="text-white">
      {/* --- Header with Welcome and Action Buttons --- */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.name}!
        </h1>
        <div className="flex gap-4">
          {/* Added the "Book a Lab" button */}
          <Link
            to="/teacher/book-a-lab"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
          >
            <Calendar size={16} className="mr-2" />
            Book a Lab
          </Link>
          <Link
            to="/teacher/report-issue"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus size={16} className="mr-2" />
            Report an Issue
          </Link>
          <Link
            to="/teacher/request-software"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-600"
          >
            <Plus size={16} className="mr-2" />
            Request Software
          </Link>
        </div>
      </div>

      {/* --- Grid for the two tables --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* --- My Ticket History Table --- */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">My Ticket History</h3>
          <div className="overflow-y-auto max-h-96">
            <table className="w-full min-w-max text-left">
              <thead>
                <tr className="text-xs font-semibold text-gray-400 uppercase">
                  <th className="py-2 pr-3">Issue</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {myTickets.length === 0 ? (
                  <tr><td colSpan="3" className="p-4 text-center text-gray-500">You haven't reported any issues.</td></tr>
                ) : (
                  myTickets.map((ticket) => (
                    <tr key={ticket.ticketId} className="text-sm text-gray-300">
                      <td className="py-3 pr-3 font-medium text-white">
                        {ticket.issueDescription.substring(0, 30)}...
                      </td>
                      <td className="py-3 pr-3"><RequestStatus status={ticket.status} /></td>
                      <td className="py-3 pr-3">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- My Software Requests Table --- */}
        <div className="bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">My Software Requests</h3>
          <div className="overflow-y-auto max-h-96">
            <table className="w-full min-w-max text-left">
              <thead>
                <tr className="text-xs font-semibold text-gray-400 uppercase">
                  <th className="py-2 pr-3">Software</th>
                  <th className="py-2 pr-3">Status</th>
                  <th className="py-2 pr-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {mySoftware.length === 0 ? (
                  <tr><td colSpan="3" className="p-4 text-center text-gray-500">You haven't requested any software.</td></tr>
                ) : (
                  mySoftware.map((req) => (
                    <tr key={req.softwareRequestId} className="text-sm text-gray-300">
                      <td className="py-3 pr-3 font-medium text-white">
                        {req.softwareName}
                      </td>
                      <td className="py-3 pr-3"><RequestStatus status={req.status} /></td>
                      <td className="py-3 pr-3">{new Date(req.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
