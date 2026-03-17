import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import GlobalModal from './components/GlobalModal';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SignupVerify from './pages/SignupVerify';
import UserDashboard from './pages/UserDashboard';
import UserWishlist from './pages/UserWishlist';
import UserBookings from './pages/UserBookings';
import UserReviews from './pages/UserReviews';
import UserProfile from './pages/UserProfile';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminListings from './pages/admin/AdminListings';
import AdminBookings from './pages/admin/AdminBookings';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

import Navbar from './components/Navbar';
import ListingsIndex from './pages/ListingsIndex';
import ShowListing from './pages/ShowListing';
import NewListing from './pages/admin/NewListing';
import EditListing from './pages/admin/EditListing';

function AppRoutes() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Paths that should not show the standard Bootstrap navbar
  const isAdminRoute = location.pathname === '/admin-dashboard' || location.pathname.startsWith('/admin/');
  const isUserRoute = location.pathname === '/dashboard' || location.pathname.startsWith('/user/');
  const isBare = ['/', '/login', '/signup', '/signup/verify'].includes(location.pathname) || isAdminRoute || isUserRoute;
  const showNavbar = !isBare;

  // Helpers: guards
  const adminGuard = (element) => {
    if (loading) return null;
    return user && user.isAdmin
      ? element
      : user
        ? <Navigate to="/dashboard" replace />
        : <Navigate to="/login" replace />;
  };

  const userGuard = (element) => {
    if (loading) return null;
    return user
      ? element
      : <Navigate to="/login" replace />;
  };

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        {/* ── PUBLIC ── */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/verify" element={<SignupVerify />} />

        {/* ── USER DASHBOARD ── */}
        <Route path="/dashboard" element={userGuard(<UserDashboard />)} />
        <Route path="/user/wishlist" element={userGuard(<UserWishlist />)} />
        <Route path="/user/bookings" element={userGuard(<UserBookings />)} />
        <Route path="/user/reviews" element={userGuard(<UserReviews />)} />
        <Route path="/user/profile" element={userGuard(<UserProfile />)} />

        {/* ── ADMIN PAGES ── */}
        <Route path="/admin-dashboard" element={adminGuard(<AdminDashboard />)} />
        <Route path="/admin/listings" element={adminGuard(<AdminListings />)} />
        <Route path="/admin/bookings" element={adminGuard(<AdminBookings />)} />
        <Route path="/admin/users" element={adminGuard(<AdminUsers />)} />
        <Route path="/admin/analytics" element={adminGuard(<AdminAnalytics />)} />
        <Route path="/admin/settings" element={adminGuard(<AdminSettings />)} />

        {/* ── USER-ONLY LISTINGS ── */}
        <Route path="/listings" element={userGuard(<ListingsIndex />)} />
        <Route path="/listings/filter" element={userGuard(<ListingsIndex />)} />
        <Route path="/listings/search" element={userGuard(<ListingsIndex />)} />

        {/* ── ADMIN-ONLY LISTING MUTATIONS ── */}
        <Route
          path="/admin/listings/new"
          element={adminGuard(<NewListing />)}
        />
        <Route
          path="/admin/listings/:id/edit"
          element={adminGuard(<EditListing />)}
        />

        {/* ── USER-ONLY LISTING DETAIL ── */}
        <Route path="/listings/:id" element={userGuard(<ShowListing />)} />

        {/* ── FALLBACK ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}



function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <Router>
          <GlobalModal />
          <AppRoutes />
        </Router>
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
