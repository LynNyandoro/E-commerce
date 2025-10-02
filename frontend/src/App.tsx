import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Box } from '@chakra-ui/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Navbar from './components/Navbar';
import AdminNavbar from './components/AdminNavbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArtworksPage from './pages/ArtworksPage';
import ArtworkDetailPage from './pages/ArtworkDetailPage';
import ArtistsPage from './pages/ArtistsPage';
import ArtistDetailPage from './pages/ArtistDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ArtworkManagementPage from './pages/admin/ArtworkManagementPage';
import ArtistManagementPage from './pages/admin/ArtistManagementPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

const AppContent: React.FC = () => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Show loading state while checking authentication
  if (isLoading) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      <Box flex="1">
        <Routes>
          {/* Root route - show home page for unauthenticated users, redirect based on user role */}
          <Route path="/" element={
            isAuthenticated ? (
              user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/artworks" replace />
            ) : (
              <HomePage />
            )
          } />
          <Route path="/artworks" element={<ArtworksPage />} />
              <Route path="/artworks/:id" element={<ArtworkDetailPage />} />
              <Route path="/artists" element={<ArtistsPage />} />
              <Route path="/artists/:id" element={<ArtistDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              
              {/* Protected Routes */}
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <AdminRoute>
                  <DashboardPage />
                </AdminRoute>
              } />
              <Route path="/admin/artworks" element={
                <AdminRoute>
                  <ArtworkManagementPage />
                </AdminRoute>
              } />
              <Route path="/admin/artists" element={
                <AdminRoute>
                  <ArtistManagementPage />
                </AdminRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminRoute>
                  <OrderManagementPage />
                </AdminRoute>
              } />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
          <Footer />
        </Box>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;