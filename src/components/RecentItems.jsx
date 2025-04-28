import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApperClient } from '../services/apperService';
import { formatDateTime } from '../utils/date';
import { 
  getTaskStatusClass, 
  getTaskPriorityClass,
  getProjectStatusClass
} from '../utils/constants';

function RecentItems() {
  const navigate = useNavigate();
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentItems = async () => {
      try {
        setLoading(true);
        const apperClient = getApperClient();
        
        // Fetch recent tasks
        const tasksResponse = await apperClient.fetchRecords('task2', {
          fields: ['Id', 'title', 'status', 'priority', 'due_date', 'CreatedOn'],
          pagingInfo: { limit: 5, offset: 0 },
          orderBy: [{ field: 'CreatedOn', direction: 'desc' }]
        });
        
        // Fetch recent projects
        const projectsResponse = await apperClient.fetchRecords('project1', {
          fields: ['Id', 'Name', 'status', 'start_date', 'end_date', 'CreatedOn'],
          pagingInfo: { limit: 5, offset: 0 },
          orderBy: [{ field: 'CreatedOn', direction: 'desc' }]
        });
        
        setRecentTasks(tasksResponse.data || []);
        setRecentProjects(projectsResponse.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recent items:', error);
        setLoading(false);
      }
    };
    
    fetchRecentItems();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="h-10 bg-gray-200 px-4 py-2"></div>
            <div className="p-4 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Recent Tasks */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-50 px-4 py-2 border-b border-blue-100">
          <h3 className="text-lg font-medium text-blue-800">Recent Tasks</h3>
        </div>
        
        {recentTasks.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">
            <p>No tasks found. Create a new task to get started.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentTasks.map(task => (
              <li 
                key={task.Id} 
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/tasks/${task.Id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">Created: {formatDateTime(task.CreatedOn)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTaskStatusClass(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTaskPriorityClass(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
          <button 
            onClick={() => navigate('/tasks')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            View all tasks &rarr;
          </button>
        </div>
      </div>
      
      {/* Recent Projects */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-purple-50 px-4 py-2 border-b border-purple-100">
          <h3 className="text-lg font-medium text-purple-800">Recent Projects</h3>
        </div>
        
        {recentProjects.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">
            <p>No projects found. Create a new project to get started.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentProjects.map(project => (
              <li 
                key={project.Id} 
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => navigate(`/projects/${project.Id}`)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{project.Name}</h4>
                    <p className="text-xs text-gray-500 mt-1">Created: {formatDateTime(project.CreatedOn)}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getProjectStatusClass(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        <div className="bg-gray-50 px-4 py-2 border-t border-gray-200">
          <button 
            onClick={() => navigate('/projects')}
            className="text-sm text-purple-600 hover:text-purple-800 font-medium"
          >
            View all projects &rarr;
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecentItems;