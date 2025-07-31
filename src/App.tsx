import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme/theme';

// Import pages
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./Register";
import LawyerDashboard from "./pages/LawyerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard/Dashboard";
import Cases from "./pages/Cases/Cases";
import Research from "./pages/Research/Research";
import CaseResearch from "./pages/CaseResearch";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import CaseDetails from "./pages/CaseDetails";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register onBackToLogin={() => window.location.href = '/login'} />} />
            <Route path="/search" element={
              <ProtectedRoute>
                <Layout>
                  <CaseResearch />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/cases" element={
              <ProtectedRoute>
                <Layout>
                  <Cases />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/research" element={
              <ProtectedRoute>
                <Layout>
                  <Research />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/case/:id" element={
              <ProtectedRoute>
                <Layout>
                  <CaseDetails />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <Layout>
                  <AdminDashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Legacy routes for compatibility */}
            <Route path='/lawyer' element={<LawyerDashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
