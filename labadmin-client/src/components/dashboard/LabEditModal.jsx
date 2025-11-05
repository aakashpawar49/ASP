import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { X } from 'lucide-react';
import Spinner from '../Spinner';

// Reusable UserSelector component
const UserSelector = ({ selectedId, onChange }) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        const inchargeUsers = response.data.filter(
          (u) => u.role === 'Admin' || u.role === 'Teacher'
        );
        setUsers(inchargeUsers);
      } catch (error) {
        toast.error("Could not load users list.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (isLoading) return <Spinner size="sm" />;

  return (
    <select
      id="labIncharge"
      value={selectedId || ''}
      onChange={onChange}
      className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
    >
      <option value="">Select an Incharge (Optional)</option>
      {users.map((user) => (
        <option key={user.userId} value={user.userId}>
          {user.name} ({user.role})
        </option>
      ))}
    </select>
  );
};

const LabEditModal = ({ lab, onClose, onSuccess }) => {
  const [labName, setLabName] = useState(lab.labName);
  const [location, setLocation] = useState(lab.location);
  const [labInchargeId, setLabInchargeId] = useState(lab.labInchargeId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/labs/${lab.labId}`, {
        labName,
        location,
        labInchargeId: labInchargeId ? parseInt(labInchargeId) : null,
      });
      
      toast.success("Lab updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update lab:", error);
      toast.error(error.response?.data || "Failed to update lab.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Edit Lab</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="labName" className="block text-sm font-medium text-gray-300 mb-2">Lab Name</label>
            <input
              type="text" id="labName" value={labName} onChange={(e) => setLabName(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">Location</label>
            <input
              type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="labIncharge" className="block text-sm font-medium text-gray-300 mb-2">Lab Incharge</label>
            <UserSelector
              selectedId={labInchargeId}
              onChange={(e) => setLabInchargeId(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LabEditModal;
