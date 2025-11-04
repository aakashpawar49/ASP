import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Layouts
import DashboardLayout from './components/DashboardLayout';

// Import Pages
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import LabTechDashboard from './pages/LabTechDashboard';
import NotFound from './pages/NotFound';

// Import new pages
import AdminOverview from './pages/AdminOverview';
import AdminAnalytics from './pages/AdminAnalytics';
import LabsManagement from './pages/LabsManagement';
import SystemsManagement from './pages/SystemsManagement';
import UsersManagement from './pages/UsersManagement';
import TicketsManagement from './pages/TicketsManagement';
import SoftwareRequests from './pages/SoftwareRequests';
import InventoryManagement from './pages/InventoryManagement';
import SchedulingManagement from './pages/SchedulingManagement';
import UsageReports from './pages/UsageReports';
import AuditTrail from './pages/AuditTrail';
import RolesPermissions from './pages/RolesPermissions';
import NotificationsSettings from './pages/NotificationsSettings';
import LabTechTickets from './pages/LabTechTickets';
import LabTechInventory from './pages/LabTechInventory';
import TeacherRequestSoftware from './pages/TeacherRequestSoftware';
import TeacherReportIssue from './pages/TeacherReportIssue';
import TeacherSchedule from './pages/TeacherSchedule';
import StudentRequestSoftware from './pages/StudentRequestSoftware';
import StudentReportIssue from './pages/StudentReportIssue';
import Profile from './pages/Profile';

function App() {
  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* === Public Routes === */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* === Dashboard Routes === */}
        <Route element={<DashboardLayout />}>
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/dashboard/overview" element={<AdminOverview />} />
          <Route path="/admin/dashboard/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/labs" element={<LabsManagement />} />
          <Route path="/admin/systems" element={<SystemsManagement />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/tickets" element={<TicketsManagement />} />
          <Route path="/admin/software" element={<SoftwareRequests />} />
          <Route path="/admin/inventory" element={<InventoryManagement />} />
          <Route path="/admin/scheduling" element={<SchedulingManagement />} />
          <Route path="/admin/reports/usage" element={<UsageReports />} />
          <Route path="/admin/reports/audit" element={<AuditTrail />} />
          <Route path="/admin/settings/roles" element={<RolesPermissions />} />
          <Route path="/admin/settings/notifications" element={<NotificationsSettings />} />

          {/* LabTech Routes */}
          <Route path="/labtech/dashboard" element={<LabTechDashboard />} />
          <Route path="/labtech/tickets" element={<LabTechTickets />} />
          <Route path="/labtech/inventory" element={<LabTechInventory />} />

          {/* Teacher Routes */}
          <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          <Route path="/teacher/request-software" element={<TeacherRequestSoftware />} />
          <Route path="/teacher/report-issue" element={<TeacherReportIssue />} />
          <Route path="/teacher/schedule" element={<TeacherSchedule />} />

          {/* Student Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/request-software" element={<StudentRequestSoftware />} />
          <Route path="/student/report-issue" element={<StudentReportIssue />} />

          {/* Shared Routes */}
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
