// src/components/PublicRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import getClientName from '../common/utils/getClientName';

// Wrapper for public routes (login, register)
export default function PublicRoute() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const clientName = getClientName();
  const userId = localStorage.getItem('userId');

  const isPublicAuthPage =
    location.pathname.endsWith('/login') || location.pathname.endsWith('/register');
  const isAppPage = location.pathname.endsWith('/dashboard') || location.pathname.includes('/admin');

  if (token && isPublicAuthPage) {
    return <Navigate to={`/${clientName}/dashboard`} replace />;
  }

  if (!token && isAppPage) {
    return <Navigate to={`/${clientName}/login`} replace />;
  }

  return <Outlet />;
}
