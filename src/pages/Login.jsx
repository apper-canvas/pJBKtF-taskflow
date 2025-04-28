import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getApperClient, getApperUI, CANVAS_ID } from '../services/apperService';
import { setUser } from '../store/userSlice';

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const apperClient = getApperClient();
    const ApperUI = getApperUI();
    
    // Setup ApperUI for authentication
    ApperUI.setup(apperClient, {
      target: '#authentication',
      clientId: CANVAS_ID,
      view: 'login',
      onSuccess: function(user) {
        // Store the user in Redux store
        dispatch(setUser(user));
        navigate('/');
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
    
    // Show login form
    ApperUI.showLogin("#authentication");
    
    // Cleanup when component unmounts
    return () => {
      try {
        ApperUI.destroy("#authentication");
      } catch (e) {
        console.log("Cleanup error", e);
      }
    };
  }, [navigate, dispatch]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to TaskFlow</h1>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>
        
        <div id="authentication" className="min-h-[400px]" />
        
        <div className="mt-6 text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;