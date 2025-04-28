import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut, Menu } from 'lucide-react';
import { clearUser } from '../store/userSlice';
import { logoutUser } from '../services/userService';

function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearUser());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMobileMenu} 
              className="md:hidden text-gray-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-gray-800">TaskFlow</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>
            
            <div className="relative">
              <button 
                onClick={toggleUserMenu}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                aria-label="User menu"
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {user?.AvatarUrl ? (
                    <img 
                      src={user.AvatarUrl} 
                      alt={`${user.FirstName} ${user.LastName}`} 
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={20} className="text-gray-500" />
                  )}
                </div>
                <span className="hidden md:block font-medium">
                  {user?.FirstName} {user?.LastName}
                </span>
              </button>
              
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/profile');
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;