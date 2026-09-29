import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Public Pages
import Home from './pages/public/Home';
import ServicesPage from './pages/public/ServicesPage';
import PlacesPage from './pages/public/PlacesPage';
import ReviewsPage from './pages/public/ReviewsPage';
import ContactPage from './pages/public/ContactPage';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';

// Driver Pages
import DriverDashboard from './pages/driver/DriverDashboard';
import DriverAvailability from './pages/driver/DriverAvailability';
import DriverBookings from './pages/driver/DriverBookings';
import ActiveDelivery from './pages/driver/ActiveDelivery';
import DriverProfile from './pages/driver/DriverProfile';
import DriverNotifications from './pages/driver/DriverNotifications';

// Company Pages
import CompanyDashboard from './pages/company/CompanyDashboard';
import AvailableDrivers from './pages/company/AvailableDrivers';
import CreateBooking from './pages/company/CreateBooking';
import CompanyBookings from './pages/company/CompanyBookings';
import CompanyDeliveries from './pages/company/CompanyDeliveries';
import CompanyReviews from './pages/company/CompanyReviews';
import CompanyProfile from './pages/company/CompanyProfile';
import CompanyNotifications from './pages/company/CompanyNotifications';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const { isAuthenticated, activeRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-navy-900 font-bold">
        Loading TruckLink Portal...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && activeRole !== allowedRole) {
    return <Navigate to={activeRole === 'DRIVER' ? '/driver/dashboard' : '/company/dashboard'} replace />;
  }

  return children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/places" element={<PlacesPage />} />
      <Route path="/reviews" element={<ReviewsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth" element={<Signup />} />

      {/* Driver Protected Routes */}
      <Route
        path="/driver/dashboard"
        element={
          <ProtectedRoute allowedRole="DRIVER">
            <DriverDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/availability"
        element={
          <ProtectedRoute allowedRole="DRIVER">
            <DriverAvailability />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/bookings"
        element={
          <ProtectedRoute allowedRole="DRIVER">
            <DriverBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/requests"
        element={
          <ProtectedRoute allowedRole="DRIVER">
            <DriverBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/delivery"
        element={
          <ProtectedRoute allowedRole="DRIVER">
            <ActiveDelivery />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/profile"
        element={
          <ProtectedRoute allowedRole="DRIVER">
            <DriverProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/notifications"
        element={
          <ProtectedRoute allowedRole="DRIVER">
            <DriverNotifications />
          </ProtectedRoute>
        }
      />

      {/* Company Protected Routes */}
      <Route
        path="/company/dashboard"
        element={
          <ProtectedRoute allowedRole="COMPANY">
            <CompanyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/drivers"
        element={
          <ProtectedRoute allowedRole="COMPANY">
            <AvailableDrivers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/create-booking"
        element={
          <ProtectedRoute allowedRole="COMPANY">
            <CreateBooking />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/bookings"
        element={
          <ProtectedRoute allowedRole="COMPANY">
            <CompanyBookings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/deliveries"
        element={
          <ProtectedRoute allowedRole="COMPANY">
            <CompanyDeliveries />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/reviews"
        element={
          <ProtectedRoute allowedRole="COMPANY">
            <CompanyReviews />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/profile"
        element={
          <ProtectedRoute allowedRole="COMPANY">
            <CompanyProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/company/notifications"
        element={
          <ProtectedRoute allowedRole="COMPANY">
            <CompanyNotifications />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}
