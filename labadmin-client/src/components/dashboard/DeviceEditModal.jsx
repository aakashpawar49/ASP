import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import { X } from 'lucide-react';
import Spinner from '../Spinner';

// Reusable component to fetch and display a list of labs
const LabSelector = ({ selectedId, onChange }) => {
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
      id="lab"
      value={selectedId || ''}
      onChange={onChange}
      className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
    >
      <option value="">Select a Lab...</option>
      {labs.map((lab) => (
        <option key={lab.labId} value={lab.labId}>
          {lab.labName} ({lab.location})
        </option>
      ))}
    </select>
  );
};

const DeviceEditModal = ({ device, onClose, onSuccess }) => {
  const [deviceName, setDeviceName] = useState(device.deviceName);
  const [deviceType, setDeviceType] = useState(device.deviceType);
  const [brand, setBrand] = useState(device.brand);
  const [model, setModel] = useState(device.model);
  const [serialNumber, setSerialNumber] = useState(device.serialNumber);
  const [status, setStatus] = useState(device.status);
  const [labId, setLabId] = useState(device.labId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.put(`/devices/${device.deviceId}`, {
        deviceName,
        deviceType,
        brand,
        model,
        serialNumber,
        status,
        labId: parseInt(labId)
      });
      
      toast.success("Device updated successfully!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Failed to update device:", error);
      toast.error(error.response?.data || "Failed to update device.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Edit System</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="deviceName" className="block text-sm font-medium text-gray-300 mb-2">System Name *</label>
              <input type="text" id="deviceName" value={deviceName} onChange={(e) => setDeviceName(e.target.value)}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
              />
            </div>
            <div>
              <label htmlFor="deviceType" className="block text-sm font-medium text-gray-300 mb-2">System Type *</label>
              <select id="deviceType" value={deviceType} onChange={(e) => setDeviceType(e.target.value)}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
              >
                <option>Computer</option>
                <option>Printer</option>
                <option>Projector</option>
                <option>Network Switch</option>
                <option>Other</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
              <input type="text" id="brand" value={brand} onChange={(e) => setBrand(e.target.value)}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
              />
            </div>
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">Model</label>
              <input type="text" id="model" value={model} onChange={(e) => setModel(e.target.value)}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
              />
            </div>
          </div>

          <div>
            <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-300 mb-2">Serial Number *</label>
            <input type="text" id="serialNumber" value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="lab" className="block text-sm font-medium text-gray-300 mb-2">Lab *</label>
              <LabSelector
                selectedId={labId}
                onChange={(e) => setLabId(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">Status *</label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
              >
                <option>Operational</option>
                <option>UnderMaintenance</option>
                <option>Offline</option>
              </select>
            </div>
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

export default DeviceEditModal;
