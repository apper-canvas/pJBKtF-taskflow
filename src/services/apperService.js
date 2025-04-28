const CANVAS_ID = '981d3bbe70814521923208e569d1424e';

// Initialize ApperClient instance
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient(CANVAS_ID);
};

// Get ApperUI instance
const getApperUI = () => {
  const { ApperUI } = window.ApperSDK;
  return ApperUI;
};

// Common function to handle API errors
const handleApiError = (error) => {
  console.error('API Error:', error);
  let errorMessage = 'An unexpected error occurred';
  
  if (error.response) {
    errorMessage = error.response.data?.message || error.response.statusText;
  } else if (error.message) {
    errorMessage = error.message;
  }
  
  throw new Error(errorMessage);
};

export { getApperClient, getApperUI, handleApiError, CANVAS_ID };