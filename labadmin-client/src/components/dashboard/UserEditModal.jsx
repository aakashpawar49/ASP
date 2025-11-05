import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { X } from 'lucide-react';

/**
 * Renders a modal to edit an existing user.
 * @param {object} props
 * @param {object} props.user - The user object to be edited.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {function} props.onSuccess - Function to call when edit is successful.
 */
const UserEditModal = ({ user, onClose, onSuccess }) => {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role, setRole] = useState(user.role);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Call the PUT /api/users/{id} endpoint
      await api.put(`/users/${user.userId}`, {
        userId: user.userId,
        name,
        email,
        role
      });
      
      toast.success("User updated successfully!");
      onSuccess(); // Tell the parent page to refresh
      onClose(); // Close this modal
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(error.response?.data || "Failed to update user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Edit User</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
            <input
              type="text" id="name" value={name} onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <input
              type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">Role</label>
            <select
              id="role" value={role} onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
            >
              <option>Student</option>
              <option>Teacher</option>
              <option>LabTech</option>
              <option>Admin</option>
            </select>
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

export default UserEditModal;
