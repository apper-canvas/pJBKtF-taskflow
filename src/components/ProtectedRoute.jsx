import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import { getApperClient } from '../services/apperService';

function ProtectedRoute() {
  const { isAuthenticated, loading } = useSelector(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const apperClient = getApperClient();
        const authStatus = await apperClient.isAuthenticated();
        
        if (!authStatus || !authStatus.isAuthenticated) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      }
    };

    if (!isAuthenticated) {
      checkAuth();
    }
  }, [isAuthenticated, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
}

export default ProtectedRoute;