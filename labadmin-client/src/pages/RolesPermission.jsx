import React from 'react';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const PermissionItem = ({ text, allowed }) => {
  return (
    <li className="flex items-center text-sm">
      {allowed ? (
        <Check size={16} className="text-green-400 mr-2 shrink-0" />
      ) : (
        <X size={16} className="text-red-500 mr-2 shrink-0" />
      )}
      <span className={allowed ? "text-gray-300" : "text-gray-500 line-through"}>
        {text}
      </span>
    </li>
  );
};


const RoleCard = ({ title, description, permissions }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg p-6">
      <h3 className="text-2xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400 mt-1 mb-4">{description}</p>
      <ul className="space-y-2">
        {permissions.map((p, index) => (
          <PermissionItem key={index} text={p.text} allowed={p.allowed} />
        ))}
      </ul>
    </div>
  );
};

const RolesPermissions = () => {
  const adminPermissions = [
    { text: 'Access Admin Dashboard', allowed: true },
    { text: 'Manage Labs, Systems, and Users', allowed: true },
    { text: 'View & Assign All Tickets', allowed: true },
    { text: 'Approve/Reject Software Requests', allowed: true },
    { text: 'Manage Inventory & Scheduling', allowed: true },
    { text: 'View All Reports & Audit Trails', allowed: true },
    { text: 'Manage System Settings', allowed: true },
  ];

  const labTechPermissions = [
    { text: 'Access LabTech Dashboard', allowed: true },
    { text: 'View & Update Assigned Tickets', allowed: true },
    { text: 'Add Work Logs to Tickets', allowed: true },
    { text: 'View Inventory', allowed: true },
    { text: 'Manage Labs, Systems, and Users', allowed: false },
    { text: 'View Reports', allowed: false },
    { text: 'Submit New Tickets/Requests', allowed: false },
  ];

  const teacherPermissions = [
    { text: 'Access Teacher Dashboard', allowed: true },
    { text: 'Submit New Tickets', allowed: true },
    { text: 'Submit Software Requests', allowed: true },
    { text: 'View Their Own Request History', allowed: true },
    { text: 'Book a Lab (Scheduling)', allowed: true },
    { text: 'Access Admin Dashboard', allowed: false },
    { text: 'Manage Tickets or Users', allowed: false },
  ];

  const studentPermissions = [
    { text: 'Access Student Dashboard', allowed: true },
    { text: 'Submit New Tickets', allowed: true },
    { text: 'Submit Software Requests', allowed: true },
    { text: 'View Their Own Request History', allowed: true },
    { text: 'Book a Lab (Scheduling)', allowed: false },
    { text: 'Access Admin Dashboard', allowed: false },
    { text: 'Manage Tickets or Users', allowed: false },
  ];

  return (
    <div className="text-white">
      <h1 className="text-3xl font-bold mb-6">Roles & Permissions</h1>
      <p className="text-gray-400 max-w-3xl mb-8">
        This page outlines the default permissions for each user role in the system.
        Role assignments are managed on the <Link to="/admin/users" className="text-blue-400 hover:underline">Users Management</Link> page.
      </p>

      {/* Grid of Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RoleCard 
          title="Admin"
          description="Full system access."
          permissions={adminPermissions}
        />
        <RoleCard 
          title="LabTech"
          description="Resolves assigned tickets."
          permissions={labTechPermissions}
        />
        <RoleCard 
          title="Teacher"
          description="Submits requests and books labs."
          permissions={teacherPermissions}
        />
        <RoleCard 
          title="Student"
          description="Submits requests."
          permissions={studentPermissions}
        />
      </div>
    </div>
  );
};

export default RolesPermissions;
