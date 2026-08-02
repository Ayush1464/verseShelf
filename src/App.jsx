import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppStateProvider } from './context/AppStateContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import BrowseBooks from './pages/public/BrowseBooks';
import BookDetails from './pages/public/BookDetails';
import PublisherPage from './pages/public/PublisherPage';
import SearchResults from './pages/public/SearchResults';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import ForgotPassword from './pages/public/ForgotPassword';
import Checkout from './pages/public/Checkout';
import Success from './pages/public/Success';

// Reader Pages
import ReaderDashboard from './pages/reader/ReaderDashboard';
import PurchasedBooks from './pages/reader/PurchasedBooks';
import PurchaseHistory from './pages/reader/PurchaseHistory';
import ReaderProfile from './pages/reader/ReaderProfile';

// Author Pages
import AuthorDashboard from './pages/author/AuthorDashboard';
import UploadBook from './pages/author/UploadBook';
import ManageBooks from './pages/author/ManageBooks';
import SalesHistory from './pages/author/SalesHistory';
import Withdrawal from './pages/author/Withdrawal';
import AuthorProfile from './pages/author/AuthorProfile';

// Publisher Pages
import PublisherDashboard from './pages/publisher/PublisherDashboard';
import PublisherUploadBook from './pages/publisher/PublisherUploadBook';
import PublisherManageBooks from './pages/publisher/PublisherManageBooks';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooks from './pages/admin/AdminBooks';
import WithdrawalRequests from './pages/admin/WithdrawalRequests';
import CommissionSettings from './pages/admin/CommissionSettings';
import AuthorsList from './pages/admin/AuthorsList';
import UsersList from './pages/admin/UsersList';
import OrdersList from './pages/admin/OrdersList';
import PublishersList from './pages/admin/PublishersList';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <AppStateProvider>
          <Routes>
            
            {/* PUBLIC ROUTES (MainLayout) */}
            <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
            <Route path="/browse" element={<MainLayout><BrowseBooks /></MainLayout>} />
            <Route path="/book/:id" element={<MainLayout><BookDetails /></MainLayout>} />
            <Route path="/publisher/:id" element={<MainLayout><PublisherPage /></MainLayout>} />
            <Route path="/search" element={<MainLayout><SearchResults /></MainLayout>} />
            <Route path="/login" element={<MainLayout><Login /></MainLayout>} />
            <Route path="/register" element={<MainLayout><Register /></MainLayout>} />
            <Route path="/forgot-password" element={<MainLayout><ForgotPassword /></MainLayout>} />
            
            {/* Checkout & Success Flow */}
            <Route path="/checkout/:bookId" element={
              <ProtectedRoute allowedRoles={['reader']}>
                <MainLayout><Checkout /></MainLayout>
              </ProtectedRoute>
            } />
            <Route path="/success" element={
              <ProtectedRoute allowedRoles={['reader']}>
                <MainLayout><Success /></MainLayout>
              </ProtectedRoute>
            } />

            {/* READER PRIVATE ROUTES (DashboardLayout) */}
            <Route path="/reader/dashboard" element={
              <ProtectedRoute allowedRoles={['reader']}>
                <DashboardLayout><ReaderDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/reader/purchased" element={
              <ProtectedRoute allowedRoles={['reader']}>
                <DashboardLayout><PurchasedBooks /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/reader/history" element={
              <ProtectedRoute allowedRoles={['reader']}>
                <DashboardLayout><PurchaseHistory /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/reader/profile" element={
              <ProtectedRoute allowedRoles={['reader']}>
                <DashboardLayout><ReaderProfile /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* AUTHOR PRIVATE ROUTES (DashboardLayout) */}
            <Route path="/author/dashboard" element={
              <ProtectedRoute allowedRoles={['author']}>
                <DashboardLayout><AuthorDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/author/upload" element={
              <ProtectedRoute allowedRoles={['author']}>
                <DashboardLayout><UploadBook /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/author/books" element={
              <ProtectedRoute allowedRoles={['author']}>
                <DashboardLayout><ManageBooks /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/author/sales" element={
              <ProtectedRoute allowedRoles={['author']}>
                <DashboardLayout><SalesHistory /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/author/withdrawal" element={
              <ProtectedRoute allowedRoles={['author']}>
                <DashboardLayout><Withdrawal /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/author/profile" element={
              <ProtectedRoute allowedRoles={['author']}>
                <DashboardLayout><AuthorProfile /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* PUBLISHER PRIVATE ROUTES (DashboardLayout) */}
            <Route path="/publisher/dashboard" element={
              <ProtectedRoute allowedRoles={['publisher']}>
                <DashboardLayout><PublisherDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/publisher/upload" element={
              <ProtectedRoute allowedRoles={['publisher']}>
                <DashboardLayout><PublisherUploadBook /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/publisher/books" element={
              <ProtectedRoute allowedRoles={['publisher']}>
                <DashboardLayout><PublisherManageBooks /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/publisher/profile" element={
              <ProtectedRoute allowedRoles={['publisher']}>
                <DashboardLayout><AuthorProfile /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* ADMIN PRIVATE ROUTES (DashboardLayout) */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout><AdminDashboard /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/books" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout><AdminBooks /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/withdrawals" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout><WithdrawalRequests /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/commissions" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout><CommissionSettings /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/authors" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout><AuthorsList /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/publishers" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout><PublishersList /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout><UsersList /></DashboardLayout>
              </ProtectedRoute>
            } />
            <Route path="/admin/orders" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout><OrdersList /></DashboardLayout>
              </ProtectedRoute>
            } />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </AppStateProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
