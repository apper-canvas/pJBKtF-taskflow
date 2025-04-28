// Task statuses
export const TASK_STATUSES = ['To Do', 'In Progress', 'Done'];

// Task priorities
export const TASK_PRIORITIES = ['Low', 'Medium', 'High'];

// Task categories
export const TASK_CATEGORIES = ['Personal', 'Work', 'Project', 'Meeting', 'Other'];

// Project statuses
export const PROJECT_STATUSES = ['Planning', 'Active', 'On Hold', 'Completed'];

// Task status to className mapping
export const getTaskStatusClass = (status) => {
  switch (status) {
    case 'To Do':
      return 'task-status-todo';
    case 'In Progress':
      return 'task-status-in-progress';
    case 'Done':
      return 'task-status-done';
    default:
      return 'task-status-todo';
  }
};

// Task priority to className mapping
export const getTaskPriorityClass = (priority) => {
  switch (priority) {
    case 'Low':
      return 'task-priority-low';
    case 'Medium':
      return 'task-priority-medium';
    case 'High':
      return 'task-priority-high';
    default:
      return 'task-priority-medium';
  }
};

// Project status to className mapping
export const getProjectStatusClass = (status) => {
  switch (status) {
    case 'Planning':
      return 'project-status-planning';
    case 'Active':
      return 'project-status-active';
    case 'On Hold':
      return 'project-status-on-hold';
    case 'Completed':
      return 'project-status-completed';
    default:
      return 'project-status-planning';
  }
};