import React from 'react'; // Removed useEffect and useState
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Import Layouts
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute'; // <-- 1. IMPORT

// Import Pages
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import LabTechDashboard from './pages/LabTechDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import NotFound from './pages/NotFound';
// Removed LoadingScreen, as AuthContext handles this

function App() {
  // 2. Removed the 'booting' state and useEffect.
  // AuthContext now shows a LoadingScreen while checking for a token.

  return (
    <>
      <Toaster position="top-right" />

      <Routes>
        {/* === Public Routes === */}
        {/* These routes are wrapped in the Layout (Header/Footer) */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        {/* These routes are standalone (no Header/Footer) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<NotFound />} />

        {/* === Protected Routes === */}
        {/* These routes check if you are logged in AND have the right role */}

        {/* Admin Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route element={<Layout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* Add more admin-only routes here */}
          </Route>
        </Route>

        {/* Student Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['Student']} />}>
          <Route element={<Layout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
          </Route>
        </Route>

        {/* LabTech Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['LabTech']} />}>
          <Route element={<Layout />}>
            <Route path="/labtech/dashboard" element={<LabTechDashboard />} />
          </Route>
        </Route>

        {/* Teacher Dashboard */}
        <Route element={<ProtectedRoute allowedRoles={['Teacher', 'Admin']} />}>
          {/* Note: We can allow Admins to see teacher pages too */}
          <Route element={<Layout />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
          </Route>
        </Route>
        
      </Routes>
    </>
  );
}

export default App;
