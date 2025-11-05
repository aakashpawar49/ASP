import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import LabCreateModal from '../components/dashboard/LabCreateModal';
import LabEditModal from '../components/dashboard/LabEditModal';
import { Plus, Edit, Trash2 } from 'lucide-react';

const LabsManagement = () => {
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);

  // Function to fetch all labs
  const fetchLabs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/labs');
      setLabs(response.data);
    } catch (error) {
      console.error("Failed to fetch labs:", error);
      toast.error("Could not load labs.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch labs on component load
  useEffect(() => {
    fetchLabs();
  }, [fetchLabs]);

  // --- Handlers for CRUD operations ---

  const handleCreateSuccess = () => {
    fetchLabs(); // Refresh the table
    toast.success("New lab created!");
  };

  const handleEditSuccess = () => {
    fetchLabs(); // Refresh the table
    toast.success("Lab updated!");
  };

  const handleEditClick = (lab) => {
    setSelectedLab(lab);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (lab) => {
    if (prompt(`Type 'DELETE' to permanently delete lab: ${lab.labName}`) !== 'DELETE') {
      toast.error("Delete operation cancelled.");
      return;
    }

    try {
      await api.delete(`/labs/${lab.labId}`);
      toast.success("Lab deleted successfully.");
      fetchLabs(); // Refresh the table
    } catch (error) {
      console.error("Failed to delete lab:", error);
      toast.error(error.response?.data || "Failed to delete lab.");
    }
  };

  if (isLoading && labs.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Labs Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Plus size={16} className="mr-2" />
          Add New Lab
        </button>
      </div>

      {/* Labs Table */}
      <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full min-w-max text-left">
          <thead>
            <tr className="text-xs font-semibold text-gray-400 uppercase border-b border-gray-700">
              <th className="p-4">Lab Name</th>
              <th className="p-4">Location</th>
              <th className="p-4">Lab Incharge</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {isLoading ? (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : labs.length === 0 ? (
              <tr><td colSpan="4" className="p-4 text-center text-gray-500">No labs found.</td></tr>
            ) : (
              labs.map((lab) => (
                <tr key={lab.labId} className="text-sm text-gray-300">
                  <td className="p-4 font-medium text-white">{lab.labName}</td>
                  <td className="p-4">{lab.location}</td>
                  <td className="p-4">{lab.labInchargeName || <span className="text-gray-500">N/A</span>}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditClick(lab)}
                        className="p-2 text-gray-400 hover:text-blue-400"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(lab)}
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
        <LabCreateModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
      {isEditModalOpen && selectedLab && (
        <LabEditModal
          lab={selectedLab}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default LabsManagement;
