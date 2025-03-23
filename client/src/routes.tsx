// client/src/routes.tsx
// به‌روزرسانی مسیرهای برنامه

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PaymentsPage from './pages/PaymentsPage';
import PaymentFormPage from './pages/PaymentFormPage';
import PaymentImagesPage from './pages/PaymentImagesPage';
import GroupsPage from './pages/GroupsPage';
import ContactsPage from './pages/ContactsPage';
import UsersPage from './pages/UsersPage';
import SmsPage from './pages/Sms';
import RequestTypesPage from './pages/RequestTypesPage';
import RequestGroupsPage from './pages/RequestGroupsPage';
import RequestSubGroupsPage from './pages/RequestSubGroupsPage';
import Layout from './components/layout/Layout';
import { useAuth } from './hooks/useAuth';

const AppRoutes: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const isFinancialManager = user?.role === 'FINANCIAL_MANAGER';
  const isAdminOrFinancial = isAdmin || isFinancialManager;

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
        
        {/* مسیرهای پرداخت */}
        <Route path="payments">
          <Route index element={<PaymentsPage />} />
          <Route path="new" element={<PaymentFormPage />} />
          <Route path=":id/edit" element={<PaymentFormPage />} />
          <Route path=":id/images" element={<PaymentImagesPage />} />
        </Route>
        
        <Route path="groups" element={<GroupsPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        
        {/* مسیرهای سیستم درخواست‌های داینامیک */}
        <Route path="request-types" element={isAdminOrFinancial ? <RequestTypesPage /> : <Navigate to="/dashboard" />} />
        <Route path="request-groups" element={isAdminOrFinancial ? <RequestGroupsPage /> : <Navigate to="/dashboard" />} />
        <Route path="request-groups/:groupId/subgroups" element={isAdminOrFinancial ? <RequestSubGroupsPage /> : <Navigate to="/dashboard" />} />
        
        {/* مسیرهای مدیریتی - فقط برای ادمین */}
        <Route path="users" element={isAdmin ? <UsersPage /> : <Navigate to="/dashboard" />} />
        <Route path="settings/sms" element={isAdmin ? <SmsPage /> : <Navigate to="/dashboard" />} />
      </Route>
      
      {/* مسیر 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;