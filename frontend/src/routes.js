import { Navigate, useRoutes } from 'react-router-dom';
import Login from './pages/auth/Login';
import PublicRoute from './components/PublicRoute';
import getClientName from './common/utils/getClientName';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import UsersAdmin from './pages/admin/UsersAdmin';
import BookingsList from './components/BookingsList';

const clientName = getClientName();

export default function AppRoutes() {
  // get user role
  const userRole = localStorage.getItem('userRole');

  const isAdmin = userRole === 'admin';

  return useRoutes([
    {
      path: '/',
      element: <Navigate to={`/${clientName}/login`} replace />,
    },
    {
      path: `/${clientName}`,
      element: <PublicRoute />,
      children: [
        { path: 'login', element: <Login /> },
        { path: 'createBooking', element: <Dashboard /> },
        { path: 'bookingList', element: <Dashboard /> },
        {
          path: 'admin/users',
          element: isAdmin ? <Dashboard /> : <Navigate to={`/${clientName}/login`} replace />,
        },
        { path: '*', element: <NotFound /> },
      ],
    },
  ]);
}
