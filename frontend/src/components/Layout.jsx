import { Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../hooks/useSubscription';
import LoadingSpinner from './LoadingSpinner';

export default function Layout({ title, children }) {
  const { user, loading } = useAuth();
  const { accesoPermitido } = useSubscription();
  const location = useLocation();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (!accesoPermitido && location.pathname !== '/suscripcion') {
    return <Navigate to="/suscripcion" replace />;
  }

  return (
    <div className="min-h-screen bg-background dark:bg-dark-bg">
      <Sidebar />
      <div className="lg:ml-[250px]">
        <Header title={title} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
