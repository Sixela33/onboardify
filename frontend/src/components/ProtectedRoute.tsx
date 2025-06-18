import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import LoadingComponent from './LoadingComponent';

export default function ProtectedRoute() {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (!user) {
    return (
      <Navigate 
        to="/auth" 
        replace 
      />
    );
  }

  return <Outlet />;
} 