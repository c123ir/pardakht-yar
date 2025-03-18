// client/src/routes.tsx
// تعریف مسیرهای برنامه

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PaymentsPage from './pages/PaymentsPage';
import GroupsPage from './pages/GroupsPage';
import ContactsPage from './pages/ContactsPage';
import Layout from './components/layout/Layout';
import { useAuth } from './hooks/useAuth';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* مسیرهای عمومی */}
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
      
      {/* مسیرهای محافظت شده */}
      <Route
        path="/"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="groups" element={<GroupsPage />} />
        <Route path="contacts" element={<ContactsPage />} />
      </Route>
      
      {/* مسیر 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
