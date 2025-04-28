import { getApperClient, handleApiError } from './apperService';

// Fetch projects with filtering and pagination
export const fetchProjects = async (filters = {}, pagination = { limit: 10, offset: 0 }) => {
  try {
    const apperClient = getApperClient();
    
    // Build filter conditions
    const conditions = [];
    
    if (filters.status) {
      conditions.push({
        field: 'status',
        operator: 'eq',
        value: filters.status
      });
    }
    
    // Set up parameters for the API call
    const params = {
      fields: [
        'Id', 'Name', 'description', 'start_date', 'end_date', 
        'status', 'team_members', 'CreatedOn', 'ModifiedOn'
      ],
      pagingInfo: {
        limit: pagination.limit,
        offset: pagination.offset
      },
      orderBy: [{ field: 'CreatedOn', direction: 'desc' }]
    };
    
    // Add filter conditions if there are any
    if (conditions.length > 0) {
      params.filter = {
        operator: 'and',
        conditions: conditions
      };
    }
    
    const response = await apperClient.fetchRecords('project1', params);
    
    return {
      data: response.data || [],
      totalCount: response.totalCount || 0
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch a single project by ID
export const fetchProjectById = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        'Id', 'Name', 'description', 'start_date', 'end_date', 
        'status', 'team_members', 'CreatedOn', 'ModifiedOn',
        'CreatedBy', 'ModifiedBy', 'Owner'
      ],
      filter: {
        operator: 'and',
        conditions: [
          {
            field: 'Id',
            operator: 'eq',
            value: id
          }
        ]
      }
    };
    
    const response = await apperClient.fetchRecords('project1', params);
    
    if (!response.data || response.data.length === 0) {
      throw new Error('Project not found');
    }
    
    return response.data[0];
  } catch (error) {
    return handleApiError(error);
  }
};

// Create a new project
export const createProject = async (projectData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      record: {
        Name: projectData.name,
        description: projectData.description || '',
        start_date: projectData.start_date || null,
        end_date: projectData.end_date || null,
        status: projectData.status || 'Planning'
      }
    };
    
    if (projectData.team_members) {
      params.record.team_members = projectData.team_members;
    }
    
    const response = await apperClient.createRecord('project1', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update an existing project
export const updateProject = async (id, projectData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      record: {
        ...projectData
      }
    };
    
    // Ensure Name is updated if name changes
    if (projectData.name) {
      params.record.Name = projectData.name;
    }
    
    const response = await apperClient.updateRecord('project1', id, params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete a project
export const deleteProject = async (id) => {
  try {
    const apperClient = getApperClient();
    await apperClient.deleteRecord('project1', id);
    return true;
  } catch (error) {
    return handleApiError(error);
  }
};