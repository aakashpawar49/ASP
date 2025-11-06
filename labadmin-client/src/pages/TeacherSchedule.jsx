import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { Send, ArrowLeft, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const TeacherSchedule = () => {
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLab, setSelectedLab] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Fetch all labs
  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const response = await api.get('/labs/list'); // Use the new public endpoint
        setLabs(response.data);
      } catch (error) {
        toast.error("Could not load labs.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLabs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedLab || !selectedDate || !selectedTime) {
      return toast.error("Please select a lab, date, and time slot.");
    }
    
    setIsSubmitting(true);
    // --- MOCK SUBMISSION ---
    // We will build the POST /api/scheduling endpoint later
    // For now, just simulate success.
    setTimeout(() => {
      console.log("Booking Request:", { selectedLab, selectedDate, selectedTime, purpose });
      toast.success("Booking request sent for approval!");
      navigate('/teacher/dashboard');
    }, 1000);
  };

  return (
    <div className="text-white">
      {/* --- Back to Dashboard Link --- */}
      <div className="mb-6">
        <Link to="/teacher/dashboard" className="flex items-center text-sm text-blue-400 hover:text-blue-300">
          <ArrowLeft size={16} className="mr-1" />
          Back to Dashboard
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Book a Lab</h1>

      {/* --- Form Card --- */}
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-2xl">
        {isLoading ? (
          <Spinner text="Loading labs..." />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label htmlFor="lab" className="block text-sm font-medium text-gray-300 mb-2">
                Which lab do you want to book? *
              </label>
              <select
                id="lab"
                value={selectedLab}
                onChange={(e) => setSelectedLab(e.target.value)}
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
              >
                <option value="">Select a lab...</option>
                {labs.map((lab) => (
                  <option key={lab.labId} value={lab.labId}>
                    {lab.labName} ({lab.location})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                  Select Date *
                </label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]} // Can't book in the past
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-2">
                  Select Time Slot *
                </label>
                <select
                  id="time"
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                  className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
                >
                  <option value="">Select a time...</option>
                  <option value="09:00-11:00">09:00 AM - 11:00 AM</option>
                  <option value="11:00-13:00">11:00 AM - 01:00 PM</option>
                  <option value="14:00-16:00">02:00 PM - 04:00 PM</option>
                  <option value="16:00-18:00">04:00 PM - 06:00 PM</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-300 mb-2">
                Purpose (e.g., Class Code, Session Name)
              </label>
              <input
                type="text"
                id="purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g., CS 101 Mid-term Exam"
                className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
              />
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                <Send size={16} className="mr-2" />
                {isSubmitting ? "Sending Request..." : "Submit Booking Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TeacherSchedule;
