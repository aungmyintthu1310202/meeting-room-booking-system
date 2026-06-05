import { Navigate, useRoutes } from 'react-router-dom';
import Login from './pages/auth/Login';
import PublicRoute from './components/PublicRoute';
import getClientName from './common/utils/getClientName';
import NotFound from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import UsersAdmin from './pages/admin/UsersAdmin';

const clientName = getClientName();

export default function AppRoutes() {
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
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'admin/users', element: <Dashboard /> },
        { path: '', element: <NotFound /> },
      ],
    },
  ]);
}
