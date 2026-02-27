/**
 * Utility functions for date handling in task management
 */

/**
 * Formats a date string or Date object to a human-readable format
 * @param {string|Date} date - The date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return '';

  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  };

  return new Intl.DateTimeFormat('en-US', defaultOptions).format(dateObj);
};

/**
 * Formats a date to YYYY-MM-DD format (used for HTML date input values)
 * @param {string|Date} date - The date to format
 * @returns {string} Date string in YYYY-MM-DD format
 */
export const formatDateForInput = (date) => {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return '';

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Checks if a given date is in the past (overdue)
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is overdue
 */
export const isOverdue = (date) => {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(dateObj);
  dueDate.setHours(0, 0, 0, 0);

  return dueDate < today;
};

/**
 * Checks if a given date is today
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date) => {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return false;

  const today = new Date();

  return (
    dateObj.getFullYear() === today.getFullYear() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getDate() === today.getDate()
  );
};

/**
 * Checks if a due date is approaching (within the next N days)
 * @param {string|Date} date - The date to check
 * @param {number} days - Number of days threshold (default: 3)
 * @returns {boolean} True if the date is within the threshold
 */
export const isDueSoon = (date, days = 3) => {
  if (!date) return false;

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return false;

  if (isOverdue(dateObj)) return false;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(dateObj);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays <= days;
};

/**
 * Returns a human-readable relative date label
 * @param {string|Date} date - The date to evaluate
 * @returns {string} A label like "Overdue", "Due today", "Due in 2 days", or the formatted date
 */
export const getRelativeDateLabel = (date) => {
  if (!date) return '';

  const dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) return '';

  if (isOverdue(dateObj)) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(dateObj);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = today - dueDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Overdue by 1 day';
    return `Overdue by ${diffDays} days`;
  }

  if (isToday(dateObj)) return 'Due today';

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueDate = new Date(dateObj);
  dueDate.setHours(0, 0, 0, 0);

  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return 'Due tomorrow';
  if (diffDays <= 7) return `Due in ${diffDays} days`;

  return `Due ${formatDate(dateObj)}`;
};

/**
 * Returns a CSS class name based on the due date status
 * @param {string|Date} date - The date to evaluate
 * @param {boolean} isCompleted - Whether the task is completed
 * @returns {string} CSS class name
 */
export const getDueDateClassName = (date, isCompleted = false) => {
  if (!date || isCompleted) return '';

  if (isOverdue(date)) return 'due-date--overdue';
  if (isToday(date)) return 'due-date--today';
  if (isDueSoon(date)) return 'due-date--soon';

  return 'due-date--upcoming';
};

/**
 * Parses a date input value and returns an ISO string or null
 * @param {string} dateString - The date string from an input field (YYYY-MM-DD)
 * @returns {string|null} ISO date string or null
 */
export const parseDateInput = (dateString) => {
  if (!dateString) return null;

  const dateObj = new Date(`${dateString}T00:00:00`);

  if (isNaN(dateObj.getTime())) return null;

  return dateObj.toISOString();
};

/**
 * Sorts an array of tasks by due date, with overdue tasks first
 * @param {Array} tasks - Array of task objects with a due_date property
 * @param {string} direction - Sort direction: 'asc' or 'desc'
 * @returns {Array} Sorted array of tasks
 */
export const sortTasksByDueDate = (tasks, direction = 'asc') => {
  if (!Array.isArray(tasks)) return [];

  return [...tasks].sort((a, b) => {
    const dateA = a.due_date ? new Date(a.due_date) : null;
    const dateB = b.due_date ? new Date(b.due_date) : null;

    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;

    const diff = dateA - dateB;
    return direction === 'asc' ? diff : -diff;
  });
};