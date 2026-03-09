import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace' }}>
          <h1 style={{ color: 'red' }}>Something went wrong</h1>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 20, background: '#f5f5f5', padding: 20, borderRadius: 8 }}>
            {this.state.error?.message}
            {'\n\n'}
            {this.state.error?.stack}
          </pre>
          <button onClick={() => { this.setState({ hasError: false }); window.location.href = '/login'; }}
            style={{ marginTop: 20, padding: '10px 20px', cursor: 'pointer' }}>
            Go to Login
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Landing Page
import LandingPage from './pages/LandingPage';

// Auth Pages
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import Assessment from './pages/student/Assessment';
import CareerExplorer from './pages/student/CareerExplorer';
import CollegeDirectory from './pages/student/CollegeDirectory';
import Chatbot from './pages/student/Chatbot';
import Profile from './pages/student/Profile';
import StudyResources from './pages/student/StudyResources';
import Scholarships from './pages/student/Scholarships';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminCareers from './pages/admin/ManageCareers';
import AdminUsers from './pages/admin/ManageUsers';



function App() {
  return (
    <ErrorBoundary>
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
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
            <Route path="users" element={<AdminUsers />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
    </ErrorBoundary>
  );
}

export default App

