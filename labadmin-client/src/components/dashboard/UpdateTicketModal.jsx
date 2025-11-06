import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { X } from 'lucide-react';

/**
 * Renders a modal for a LabTech to update a ticket.
 * @param {object} props
 * @param {object} props.ticket - The ticket object to be updated.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {function} props.onSuccess - Function to call when update is successful.
 */
const UpdateTicketModal = ({ ticket, onClose, onSuccess }) => {
  // A LabTech can set these two statuses
  const [newStatus, setNewStatus] = useState('InProgress');
  const [actionTaken, setActionTaken] = useState('');
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle the "Submit Update" button click
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!actionTaken) {
      return toast.error("Please describe the action you took.");
    }
    
    setIsSubmitting(true);
    try {
      // Call the endpoint we tested in Swagger
      await api.put(`/tickets/${ticket.ticketId}/tech-update`, {
        newStatus,
        actionTaken,
        remarks
      });
      
      toast.success(`Ticket status set to "${newStatus}"!`);
      onSuccess(); // Tell the parent page (LabTechDashboard) to refresh
      onClose(); // Close this modal
    } catch (error) {
      console.error("Failed to update ticket:", error);
      toast.error(error.response?.data || "Failed to update ticket.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Modal Content */}
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Update Ticket</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-sm text-gray-400">You are updating:</p>
            <p className="text-lg text-white font-medium">
              "{ticket.issueDescription}"
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Reported by: {ticket.requester?.name || 'Unknown'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="newStatus" className="block text-sm font-medium text-gray-300 mb-2">
                Set New Status *
              </label>
              <select
                id="newStatus"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
              >
                <option value="InProgress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="actionTaken" className="block text-sm font-medium text-gray-300 mb-2">
                Action Taken *
              </label>
              <textarea
                id="actionTaken"
                rows="3"
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                placeholder="e.g., Replaced faulty mouse with new one from inventory."
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
              />
            </div>
            <div>
              <label htmlFor="remarks" className="block text-sm font-medium text-gray-300 mb-2">
                Remarks (Optional)
              </label>
              <textarea
                id="remarks"
                rows="2"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g., User's old mouse was a Logitech M185."
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTicketModal;
