import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  CheckSquare, 
  Folder, 
  User,
  BarChart2
} from 'lucide-react';

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside 
      className={`bg-gray-800 text-white transition-all duration-300 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      } hidden md:block`}
    >
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-xl font-bold">TaskFlow</h2>
        )}
        <button 
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-700 focus:outline-none"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-6 w-6 transition-transform ${collapsed ? 'rotate-180' : ''}`} 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7" 
            />
          </svg>
        </button>
      </div>
      
      <nav className="mt-8">
        <ul className="space-y-2 px-2">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-md ${
                  isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
                } ${collapsed ? 'justify-center' : 'px-4'}`
              }
            >
              <Home size={20} />
              {!collapsed && <span className="ml-3">Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/tasks" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-md ${
                  isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
                } ${collapsed ? 'justify-center' : 'px-4'}`
              }
            >
              <CheckSquare size={20} />
              {!collapsed && <span className="ml-3">Tasks</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/projects" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-md ${
                  isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
                } ${collapsed ? 'justify-center' : 'px-4'}`
              }
            >
              <Folder size={20} />
              {!collapsed && <span className="ml-3">Projects</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `flex items-center p-2 rounded-md ${
                  isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
                } ${collapsed ? 'justify-center' : 'px-4'}`
              }
            >
              <User size={20} />
              {!collapsed && <span className="ml-3">Profile</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;