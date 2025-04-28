import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { formatDateTime } from '../utils/date';
import { logoutUser } from '../services/userService';
import { useDispatch } from 'react-redux';
import { clearUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, loading } = useSelector(state => state.user);
  const [userDetails, setUserDetails] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setUserDetails(user);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearUser());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading || !userDetails) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Profile</h1>
        <p className="text-gray-600">View and manage your account information</p>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {userDetails.AvatarUrl ? (
                <img 
                  src={userDetails.AvatarUrl} 
                  alt={`${userDetails.FirstName} ${userDetails.LastName}`} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <User size={40} className="text-gray-500" />
              )}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl font-bold text-gray-900">
                {userDetails.FirstName} {userDetails.LastName}
              </h2>
              <div className="mt-1 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 justify-center md:justify-start">
                <div className="flex items-center text-gray-600">
                  <Mail size={16} className="mr-1" />
                  {userDetails.Email || userDetails.emailAddress || 'No email available'}
                </div>
                {userDetails.Phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone size={16} className="mr-1" />
                    {userDetails.Phone}
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {userDetails.IsEmailVerified && (
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                    Email Verified
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">User ID</p>
                <p className="text-gray-700">{userDetails.Id || userDetails.id || 'N/A'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Last Login</p>
                <p className="flex items-center text-gray-700">
                  <Calendar size={16} className="mr-2" />
                  {userDetails.LastLoginDate 
                    ? formatDateTime(userDetails.LastLoginDate)
                    : 'Not available'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Account Created</p>
                <p className="text-gray-700">
                  {userDetails.CreatedOn 
                    ? formatDateTime(userDetails.CreatedOn)
                    : 'Not available'}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Last Password Change</p>
                <p className="text-gray-700">
                  {userDetails.LastPasswordChangeDate 
                    ? formatDateTime(userDetails.LastPasswordChangeDate)
                    : 'Not available'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
            
            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full sm:w-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm5 5a1 1 0 00-1 1v4a1 1 0 002 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
                  <path d="M14 7V5.586l-2.293-2.293-1.414 1.414L12.586 7H14z" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;