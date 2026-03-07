import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import Assessment from './pages/student/Assessment';
import CareerExplorer from './pages/student/CareerExplorer';
import CollegeDirectory from './pages/student/CollegeDirectory';
import Timeline from './pages/student/Timeline';
import Chatbot from './pages/student/Chatbot';
import Profile from './pages/student/Profile';
import StudyResources from './pages/student/StudyResources';
import Scholarships from './pages/student/Scholarships';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminCareers from './pages/admin/ManageCareers';



function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Student Routes */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="assessment" element={<Assessment />} />
            <Route path="careers" element={<CareerExplorer />} />
            <Route path="colleges" element={<CollegeDirectory />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="chatbot" element={<Chatbot />} />
            <Route path="profile" element={<Profile />} />
            <Route path="resources" element={<StudyResources />} />
            <Route path="scholarships" element={<Scholarships />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="careers" element={<AdminCareers />} />
            <Route path="colleges" element={<AdminCareers />} />
            <Route path="resources" element={<AdminCareers />} />
            <Route path="scholarships" element={<AdminCareers />} />
            <Route path="students" element={<AdminDashboard />} />
            <Route path="schedule" element={<AdminDashboard />} />
            <Route path="users" element={<AdminDashboard />} />
            <Route path="settings" element={<AdminDashboard />} />
          </Route>

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App

