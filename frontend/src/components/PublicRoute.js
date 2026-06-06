// src/components/PublicRoute.js
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import getClientName from '../common/utils/getClientName';

// Helper: check if token is expired
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT payload
    const expiry = payload.exp * 1000; // exp is in seconds → convert to ms
    return Date.now() > expiry;
  } catch (e) {
    return true; // if decoding fails, treat as expired
  }
}

export default function PublicRoute() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  const clientName = getClientName();

  const isPublicAuthPage =
    location.pathname.endsWith('/login') || location.pathname.endsWith('/register');
  const isAppPage =
    location.pathname.endsWith('/createBooking') || location.pathname.includes('/admin');

  // Check token expiry
  if (token && isTokenExpired(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    return <Navigate to={`/${clientName}/login`} replace />;
  }

  if (token && isPublicAuthPage) {
    return <Navigate to={`/${clientName}/createBooking`} replace />;
  }

  if (!token && isAppPage) {
    return <Navigate to={`/${clientName}/login`} replace />;
  }

  return <Outlet />;
}
