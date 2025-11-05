import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { Send } from 'lucide-react';

const StudentReportIssue = () => {
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch all devices so the student can select one
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        // This is the endpoint we just fixed
        const response = await api.get('/devices/list');
        setDevices(response.data);
      } catch (error) {
        toast.error("Could not load devices.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDevices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDevice || !description) {
      return toast.error("Please select a device and describe the issue.");
    }
    
    setIsSubmitting(true);
    try {
      // Call the POST /api/tickets endpoint
      await api.post('/tickets', {
        deviceId: parseInt(selectedDevice),
        issueDescription: description
      });
      
      toast.success("Issue reported successfully!");
      navigate('/student/dashboard'); // Go back to their dashboard
    } catch (error) {
      console.error("Failed to report issue:", error);
      toast.error(error.response?.data || "Failed to report issue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-white">
        <h1 className="text-3xl font-bold mb-6">Report an Issue</h1>
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-2xl">
          <Spinner text="Loading devices..." />
        </div>
      </div>
    );
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Report an Issue</h1>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="device" className="block text-sm font-medium text-gray-300 mb-2">
              Which system has an issue? *
            </label>
            <select
              id="device"
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
            >
              <option value="">Select a device...</option>
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.labName} - {device.deviceName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              Please describe the issue *
            </label>
            <textarea
              id="description"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., The mouse for this PC is not working or is missing."
              className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              <Send size={16} className="mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentReportIssue;
