import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import UserCreateModal from '../components/dashboard/UserCreateModal';
import UserEditModal from '../components/dashboard/UserEditModal';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Role-based colors for the tag
const RoleTag = ({ role }) => {
  const colors = {
    Admin: 'bg-red-900 text-red-300',
    LabTech: 'bg-blue-900 text-blue-300',
    Teacher: 'bg-green-900 text-green-300',
    Student: 'bg-gray-700 text-gray-300',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[role] || colors.Student}`}>
      {role}
    </span>
  );
};

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Function to fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Could not load users.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch users on component load
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- Handlers for CRUD operations ---

  const handleCreateSuccess = () => {
    fetchUsers(); // Refresh the table
    toast.success("New user created!");
  };

  const handleEditSuccess = () => {
    fetchUsers(); // Refresh the table
    toast.success("User updated!");
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (user) => {
    // We can't use window.confirm, so we use a simple prompt
    if (prompt(`Type 'DELETE' to permanently delete user: ${user.name}`) !== 'DELETE') {
      toast.error("Delete operation cancelled.");
      return;
    }

    try {
      await api.delete(`/users/${user.userId}`);
      toast.success("User deleted successfully.");
      fetchUsers(); // Refresh the table
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error(error.response?.data || "Failed to delete user.");
    }
  };

  if (isLoading && users.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Users Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Plus size={16} className="mr-2" />
          Add New User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full min-w-max text-left">
          <thead>
            <tr className="text-xs font-semibold text-gray-400 uppercase border-b border-gray-700">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {isLoading ? (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">No users found.</td></tr>
            ) : (
              users.map((user) => (
                <tr key={user.userId} className="text-sm text-gray-300 hover:bg-gray-700">
                  <td className="p-4 font-medium text-white">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4"><RoleTag role={user.role} /></td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="p-2 text-gray-400 hover:text-blue-400"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        className="p-2 text-gray-400 hover:text-red-500"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {isCreateModalOpen && (
        <UserCreateModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
      {isEditModalOpen && selectedUser && (
        <UserEditModal
          user={selectedUser}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default UsersManagement;