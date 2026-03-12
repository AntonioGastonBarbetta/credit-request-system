import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CreditRequestsPage from './pages/CreditRequestsPage';
import CreditRequestDetailPage from './pages/CreditRequestDetailPage';
import CreateCreditRequestPage from './pages/CreateCreditRequestPage';
import Layout from './components/Layout';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CreditRequestsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/credit-requests/create" element={<CreateCreditRequestPage />} />
        <Route path="/credit-requests/:id" element={<CreditRequestDetailPage />} />
        <Route path="*" element={<div>Not Found — <Link to="/">Go home</Link></div>} />
      </Routes>
    </Layout>
  );
}
