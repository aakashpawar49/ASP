import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import LoadingScreen from '../components/LoadingScreen';
import Spinner from '../components/Spinner';

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

// --- Sub-component: Profile Details Card ---
const ProfileDetails = ({ user }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg h-full">
      <h3 className="text-xl font-semibold text-white mb-4">Profile Details</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-400">Full Name</label>
          <p className="text-lg text-white">{user.name}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-400">Email Address</label>
          <p className="text-lg text-white">{user.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-400">Role</label>
          <div className="mt-1">
            <RoleTag role={user.role} />
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-component: Change Password Form ---
const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Client-side validation
    if (newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters long.");
    }
    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match.");
    }

    setIsSubmitting(true);
    try {
      // 2. Call the API endpoint
      await api.put('/users/me/password', {
        currentPassword,
        newPassword
      });

      toast.success("Password changed successfully!");
      // 3. Reset the form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {
      console.error("Failed to change password:", error);
      toast.error(error.response?.data || "Failed to change password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-xl font-semibold text-white mb-4">Change Password</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full bg-gray-700 border-gray-600 text-white rounded-md p-2"
          />
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};


// --- Main Profile Page Component ---
const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the user's own profile data on load
  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const response = await api.get('/users/me');
        setUserProfile(response.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        toast.error("Could not load your profile.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyProfile();
  }, []);

  if (isLoading || !userProfile) {
    return <LoadingScreen />;
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Profile Details */}
        <div className="lg:col-span-1">
          <ProfileDetails user={userProfile} />
        </div>

        {/* Column 2: Change Password */}
        <div className="lg:col-span-2">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
};

export default Profile;
