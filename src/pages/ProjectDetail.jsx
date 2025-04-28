import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Calendar, Edit, Trash2 } from 'lucide-react';
import { fetchProjectById, clearCurrentProject, deleteProject, updateProject, createProject } from '../store/projectsSlice';
import { getProjectStatusClass } from '../utils/constants';
import { formatDate, formatDateTime } from '../utils/date';
import ProjectForm from '../components/ProjectForm';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentProject, loading, error } = useSelector(state => state.projects);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isNew = id === 'new';

  useEffect(() => {
    // Set edit mode if route contains /edit
    if (location.pathname.includes('/edit')) {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [location]);

  useEffect(() => {
    // Clear current project when component unmounts
    return () => {
      dispatch(clearCurrentProject());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isNew && !isEditing) {
      dispatch(fetchProjectById(id));
    }
  }, [dispatch, id, isNew, isEditing]);

  const handleSubmit = async (formData) => {
    try {
      if (isNew) {
        await dispatch(createProject(formData)).unwrap();
        navigate('/projects', { state: { refresh: true } });
      } else {
        await dispatch(updateProject({ id, projectData: formData })).unwrap();
        navigate(`/projects/${id}`, { state: { refresh: true } });
      }
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/projects/${id}/edit`);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteProject(id)).unwrap();
      navigate('/projects', { state: { refresh: true } });
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  if (loading && !isNew && !isEditing) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !isNew) {
    return (
      <div className="p-4 bg-red-50 text-red-800 rounded-md">
        <h2 className="text-xl font-bold mb-2">Error Loading Project</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate('/projects')}
          className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md flex items-center"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Projects
        </button>
      </div>
    );
  }

  if (isNew || isEditing) {
    return (
      <div>
        <div className="mb-6 flex items-center">
          <button
            onClick={() => navigate(isNew ? '/projects' : `/projects/${id}`)}
            className="mr-4 p-2 rounded-full hover:bg-gray-200"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            {isNew ? 'Create New Project' : 'Edit Project'}
          </h1>
        </div>
        
        <ProjectForm 
          project={isNew ? null : currentProject} 
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => navigate('/projects')}
          className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Projects
        </button>
        
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-gray-800">{currentProject?.Name}</h1>
          <div className="flex space-x-2">
            <button
              onClick={handleEdit}
              className="p-2 text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md flex items-center"
            >
              <Edit size={18} className="mr-1" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-md flex items-center"
            >
              <Trash2 size={18} className="mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-wrap gap-4 mb-6">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getProjectStatusClass(currentProject?.status)}`}>
              {currentProject?.status}
            </div>
            
            <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm font-medium flex items-center">
              <Calendar size={14} className="mr-1" />
              {currentProject?.start_date ? formatDate(currentProject.start_date) : 'No start date'} 
              {' - '} 
              {currentProject?.end_date ? formatDate(currentProject.end_date) : 'No end date'}
            </div>
          </div>
          
          <div className="prose max-w-none">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
            <div className="text-gray-700 whitespace-pre-wrap">
              {currentProject?.description || <span className="text-gray-400 italic">No description provided</span>}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-gray-700">
                  {formatDateTime(currentProject?.CreatedOn)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Modified</p>
                <p className="text-gray-700">
                  {formatDateTime(currentProject?.ModifiedOn)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Deletion</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this project? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
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

export default ProjectDetail;