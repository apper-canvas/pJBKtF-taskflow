import { getApperClient, handleApiError } from './apperService';

// Get user profile
export const getUserProfile = async () => {
  try {
    const apperClient = getApperClient();
    // The user profile is already available when authenticated
    // Just return the current user from the client
    const authStatus = await apperClient.isAuthenticated();
    return authStatus.user || null;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const apperClient = getApperClient();
    const params = { record: userData };
    const response = await apperClient.updateRecord('User', userData.Id, params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Log out user
export const logoutUser = async () => {
  try {
    const apperClient = getApperClient();
    await apperClient.logout();
    return true;
  } catch (error) {
    return handleApiError(error);
  }
};