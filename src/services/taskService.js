import { getApperClient, handleApiError } from './apperService';

// Fetch tasks with filtering and pagination
export const fetchTasks = async (filters = {}, pagination = { limit: 10, offset: 0 }) => {
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
    
    if (filters.priority) {
      conditions.push({
        field: 'priority',
        operator: 'eq',
        value: filters.priority
      });
    }
    
    if (filters.category) {
      conditions.push({
        field: 'category',
        operator: 'eq',
        value: filters.category
      });
    }
    
    // Set up parameters for the API call
    const params = {
      fields: [
        'Id', 'Name', 'title', 'description', 'status', 'priority', 
        'due_date', 'assignee', 'category', 'CreatedOn', 'ModifiedOn'
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
    
    const response = await apperClient.fetchRecords('task2', params);
    
    return {
      data: response.data || [],
      totalCount: response.totalCount || 0
    };
  } catch (error) {
    return handleApiError(error);
  }
};

// Fetch a single task by ID
export const fetchTaskById = async (id) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      fields: [
        'Id', 'Name', 'title', 'description', 'status', 'priority', 
        'due_date', 'assignee', 'category', 'CreatedOn', 'ModifiedOn',
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
    
    const response = await apperClient.fetchRecords('task2', params);
    
    if (!response.data || response.data.length === 0) {
      throw new Error('Task not found');
    }
    
    return response.data[0];
  } catch (error) {
    return handleApiError(error);
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      record: {
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'To Do',
        priority: taskData.priority || 'Medium',
        due_date: taskData.due_date || null,
        category: taskData.category || 'Work',
        // Name field is required for the record
        Name: taskData.title
      }
    };
    
    if (taskData.assignee) {
      params.record.assignee = taskData.assignee;
    }
    
    const response = await apperClient.createRecord('task2', params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Update an existing task
export const updateTask = async (id, taskData) => {
  try {
    const apperClient = getApperClient();
    
    const params = {
      record: {
        ...taskData,
        // Ensure Name is updated if title changes
        Name: taskData.title || taskData.Name
      }
    };
    
    const response = await apperClient.updateRecord('task2', id, params);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Delete a task
export const deleteTask = async (id) => {
  try {
    const apperClient = getApperClient();
    await apperClient.deleteRecord('task2', id);
    return true;
  } catch (error) {
    return handleApiError(error);
  }
};