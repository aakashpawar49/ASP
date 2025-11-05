import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import DeviceCreateModal from '../components/dashboard/DeviceCreateModal';
import DeviceEditModal from '../components/dashboard/DeviceEditModal';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Spinner from '../components/Spinner';

// Status Tag for the table
const DeviceStatus = ({ status }) => {
  const colors = {
    Operational: 'bg-green-900 text-green-300',
    UnderMaintenance: 'bg-yellow-900 text-yellow-300',
    Offline: 'bg-red-900 text-red-300',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-700 text-gray-300'}`}>
      {status}
    </span>
  );
};

// Lab Filter Dropdown
const LabFilter = ({ selectedId, onChange }) => {
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await api.get('/labs');
        setLabs(response.data);
      } catch (error) {
        toast.error("Could not load labs list.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLabs();
  }, []);

  if (isLoading) return <Spinner size="sm" />;

  return (
    <select
      id="labFilter"
      value={selectedId || ''}
      onChange={onChange}
      className="bg-gray-700 border-gray-600 text-white rounded-md p-2"
    >
      <option value="">All Labs</option>
      {labs.map((lab) => (
        <option key={lab.labId} value={lab.labId}>
          {lab.labName}
        </option>
      ))}
    </select>
  );
};

const SystemsManagement = () => {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [labFilter, setLabFilter] = useState('');
  
  // State for modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // Function to fetch all devices
  const fetchDevices = useCallback(async () => {
    try {
      setIsLoading(true);
      // Use the ?labId= filter
      const response = await api.get('/devices', {
        params: { labId: labFilter || null }
      });
      setDevices(response.data);
    } catch (error) {
      console.error("Failed to fetch devices:", error);
      toast.error("Could not load devices.");
    } finally {
      setIsLoading(false);
    }
  }, [labFilter]); // Re-fetch when labFilter changes

  // Fetch devices on component load
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // --- Handlers for CRUD operations ---
  const handleCreateSuccess = () => { fetchDevices(); toast.success("New system created!"); };
  const handleEditSuccess = () => { fetchDevices(); toast.success("System updated!"); };

  const handleEditClick = (device) => {
    setSelectedDevice(device);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = async (device) => {
    if (prompt(`Type 'DELETE' to permanently delete system: ${device.deviceName}`) !== 'DELETE') {
      toast.error("Delete operation cancelled.");
      return;
    }
    try {
      await api.delete(`/devices/${device.deviceId}`);
      toast.success("System deleted successfully.");
      fetchDevices();
    } catch (error) {
      console.error("Failed to delete device:", error);
      toast.error(error.response?.data || "Failed to delete device.");
    }
  };

  if (isLoading && devices.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className="text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Systems Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Plus size={16} className="mr-2" />
          Add New System
        </button>
      </div>

      {/* Filter Bar */}
      <div className="mb-4">
        <label htmlFor="labFilter" className="text-sm text-gray-400 mr-2">Filter by Lab:</label>
        <LabFilter
          selectedId={labFilter}
          onChange={(e) => setLabFilter(e.target.value)}
        />
      </div>

      {/* Devices Table */}
      <div className="bg-gray-900 rounded-xl shadow-lg overflow-hidden">
        <table className="w-full min-w-max text-left">
          <thead>
            <tr className="text-xs font-semibold text-gray-400 uppercase border-b border-gray-700">
              <th className="p-4">System Name</th>
              <th className="p-4">Type</th>
              <th className="p-4">Lab</th>
              <th className="p-4">Serial #</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {isLoading ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">Loading...</td></tr>
            ) : devices.length === 0 ? (
              <tr><td colSpan="6" className="p-4 text-center text-gray-500">No systems found.</td></tr>
            ) : (
              devices.map((device) => (
                <tr key={device.deviceId} className="text-sm text-gray-300">
                  <td className="p-4 font-medium text-white">{device.deviceName}</td>
                  <td className="p-4">{device.deviceType}</td>
                  <td className="p-4">{device.labName || <span className="text-gray-500">N/A</span>}</td>
                  <td className="p-4">{device.serialNumber}</td>
                  <td className="p-4"><DeviceStatus status={device.status} /></td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditClick(device)}
                        className="p-2 text-gray-400 hover:text-blue-400"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(device)}
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
        <DeviceCreateModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
      {isEditModalOpen && selectedDevice && (
        <DeviceEditModal
          device={selectedDevice}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default SystemsManagement;
