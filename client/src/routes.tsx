// client/src/routes.tsx
// به‌روزرسانی مسیرهای برنامه

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PaymentsPage from './pages/PaymentsPage';
import GroupsPage from './pages/GroupsPage';
import ContactsPage from './pages/ContactsPage';
import UsersPage from './pages/UsersPage';
import SmsSettingsPage from './pages/SmsSettingsPage';
import Layout from './components/layout/Layout';
import { useAuth } from './hooks/useAuth';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

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
        
        {/* مسیرهای مدیریتی - فقط برای ادمین */}
        <Route path="users" element={isAdmin ? <UsersPage /> : <Navigate to="/dashboard" />} />
        <Route path="settings/sms" element={isAdmin ? <SmsSettingsPage /> : <Navigate to="/dashboard" />} />
      </Route>
      
      {/* مسیر 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;