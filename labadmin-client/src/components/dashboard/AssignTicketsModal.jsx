import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import Spinner from '../Spinner';
import { X } from 'lucide-react';

/**
 * Renders a modal to assign a ticket to a technician.
 * @param {object} props
 * @param {object} props.ticket - The ticket object to be assigned.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {function} props.onSuccess - Function to call when assignment is successful.
 */
const AssignTicketModal = ({ ticket, onClose, onSuccess }) => {
  const [technicians, setTechnicians] = useState([]);
  const [selectedTechId, setSelectedTechId] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch the list of available technicians when the modal opens
  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/users/technicians');
        setTechnicians(response.data);
      } catch (error) {
        console.error("Failed to fetch technicians:", error);
        toast.error("Could not load technicians.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchTechnicians();
  }, []);

  // Handle the "Confirm Assignment" button click
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTechId) {
      return toast.error("Please select a technician.");
    }
    
    setIsSubmitting(true);
    try {
      // Call the API endpoint we tested in Swagger
      await api.put(`/tickets/${ticket.ticketId}/assign`, { 
        technicianId: parseInt(selectedTechId) 
      });
      
      toast.success("Ticket assigned successfully!");
      onSuccess(); // Tell the parent page to refresh its data
      onClose(); // Close the modal
    } catch (error) {
      console.error("Failed to assign ticket:", error);
      toast.error("Failed to assign ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // Full-screen overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Content */}
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Assign Ticket</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-sm text-gray-400">You are assigning:</p>
            <p className="text-lg text-white font-medium">
              "{ticket.issueDescription.substring(0, 50)}..."
            </p>
          </div>

          <div className="mb-6">
            <label htmlFor="technician" className="block text-sm font-medium text-gray-300 mb-2">
              Assign to Technician
            </label>
            {isLoading ? (
              <Spinner text="Loading technicians..." />
            ) : (
              <select
                id="technician"
                value={selectedTechId}
                onChange={(e) => setSelectedTechId(e.target.value)}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a technician...</option>
                {technicians.map((tech) => (
                  <option key={tech.userId} value={tech.userId}>
                    {tech.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Assigning..." : "Confirm Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTicketModal;
