import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  fetchTasks, 
  deleteTask,
  setFilters as setTaskFilters,
  setPagination as setTaskPagination
} from '../store/tasksSlice';
import TaskList from '../components/TaskList';

function Tasks() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { tasks, loading, error, totalCount, filters, pagination } = useSelector(state => state.tasks);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  // Check if we're navigating back from a task creation/edit
  useEffect(() => {
    if (location.state?.refresh) {
      dispatch(fetchTasks({ filters, pagination }));
    }
  }, [location, dispatch, filters, pagination]);

  useEffect(() => {
    dispatch(fetchTasks({ filters, pagination }));
  }, [dispatch, filters, pagination]);

  const handleDelete = (taskId) => {
    setTaskToDelete(taskId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      await dispatch(deleteTask(taskToDelete));
      setShowDeleteConfirm(false);
      setTaskToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setTaskToDelete(null);
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setTaskFilters(newFilters));
  };

  const handlePaginationChange = (newPagination) => {
    dispatch(setTaskPagination(newPagination));
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <h2 className="text-xl font-bold mb-2">Error Loading Tasks</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tasks Management</h1>
        <p className="text-gray-600">Create, view, and manage your tasks</p>
      </div>
      
      <TaskList 
        tasks={tasks}
        loading={loading}
        totalCount={totalCount}
        onDelete={handleDelete}
        onFilter={handleFilterChange}
        filters={filters}
        pagination={pagination}
        onPaginationChange={handlePaginationChange}
      />
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;