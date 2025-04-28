import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardSummary from '../components/DashboardSummary';
import RecentItems from '../components/RecentItems';

function Dashboard() {
  const { user } = useSelector(state => state.user);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      
      if (hour < 12) {
        return 'Good morning';
      } else if (hour < 18) {
        return 'Good afternoon';
      } else {
        return 'Good evening';
      }
    };
    
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {greeting}, {user?.FirstName || 'User'}!
        </h1>
        <p className="text-gray-600">
          Welcome to your TaskFlow dashboard. Here's an overview of your tasks and projects.
        </p>
      </div>
      
      <DashboardSummary />
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
        <RecentItems />
      </div>
    </div>
  );
}

export default Dashboard;