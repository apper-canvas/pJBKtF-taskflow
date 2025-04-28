import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Circle, Clock, AlertTriangle } from 'lucide-react';
import { getApperClient } from '../services/apperService';

function DashboardSummary() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    highPriorityTasks: 0,
    activeProjects: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const apperClient = getApperClient();
        
        // Fetch task counts
        const tasksResponse = await apperClient.fetchRecords('task2', {
          fields: ['Id', 'status', 'priority'],
          pagingInfo: { limit: 1000, offset: 0 }
        });
        
        // Fetch project counts
        const projectsResponse = await apperClient.fetchRecords('project1', {
          fields: ['Id', 'status'],
          filter: {
            operator: 'and',
            conditions: [
              {
                field: 'status',
                operator: 'eq',
                value: 'Active'
              }
            ]
          }
        });
        
        const tasks = tasksResponse.data || [];
        
        // Calculate task statistics
        const completed = tasks.filter(task => task.status === 'Done').length;
        const pending = tasks.filter(task => task.status !== 'Done').length;
        const highPriority = tasks.filter(task => task.priority === 'High').length;
        
        setStats({
          totalTasks: tasks.length,
          completedTasks: completed,
          pendingTasks: pending,
          highPriorityTasks: highPriority,
          activeProjects: projectsResponse.totalCount || 0
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const statsItems = [
    {
      id: 1,
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: <Circle className="h-6 w-6 text-blue-500" />,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      link: '/tasks'
    },
    {
      id: 2,
      title: 'Completed Tasks',
      value: stats.completedTasks,
      icon: <CheckCircle className="h-6 w-6 text-green-500" />,
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      link: '/tasks'
    },
    {
      id: 3,
      title: 'Pending Tasks',
      value: stats.pendingTasks,
      icon: <Clock className="h-6 w-6 text-yellow-500" />,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      link: '/tasks'
    },
    {
      id: 4,
      title: 'High Priority',
      value: stats.highPriorityTasks,
      icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      link: '/tasks'
    },
    {
      id: 5,
      title: 'Active Projects',
      value: stats.activeProjects,
      icon: <Folder className="h-6 w-6 text-purple-500" />,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      link: '/projects'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {statsItems.map((item) => (
        <Link 
          key={item.id} 
          to={item.link} 
          className={`${item.bgColor} p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">{item.title}</h3>
            {item.icon}
          </div>
          <div className={`text-3xl font-bold ${item.textColor}`}>{item.value}</div>
          <p className="mt-2 text-sm text-gray-600">View details &rarr;</p>
        </Link>
      ))}
    </div>
  );
}

// Need to import Folder icon at the top
import { Folder } from 'lucide-react';

export default DashboardSummary;