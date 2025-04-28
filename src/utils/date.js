import { format, parseISO, isValid } from 'date-fns';

// Format date to display format
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  
  if (!isValid(date)) return '';
  
  return format(date, 'MMM d, yyyy');
};

// Format date with time
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  
  if (!isValid(date)) return '';
  
  return format(date, 'MMM d, yyyy h:mm a');
};

// Format date for input fields
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
  
  if (!isValid(date)) return '';
  
  return format(date, 'yyyy-MM-dd');
};