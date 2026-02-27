export const PRIORITIES = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
};

export const PRIORITY_LEVELS = [
  PRIORITIES.HIGH,
  PRIORITIES.MEDIUM,
  PRIORITIES.LOW,
];

export const PRIORITY_COLORS = {
  [PRIORITIES.HIGH]: {
    background: '#fef2f2',
    border: '#fca5a5',
    text: '#dc2626',
    badge: '#ef4444',
  },
  [PRIORITIES.MEDIUM]: {
    background: '#fffbeb',
    border: '#fcd34d',
    text: '#d97706',
    badge: '#f59e0b',
  },
  [PRIORITIES.LOW]: {
    background: '#f0fdf4',
    border: '#86efac',
    text: '#16a34a',
    badge: '#22c55e',
  },
};

export const PRIORITY_ICONS = {
  [PRIORITIES.HIGH]: '🔴',
  [PRIORITIES.MEDIUM]: '🟡',
  [PRIORITIES.LOW]: '🟢',
};

export const PRIORITY_ORDER = {
  [PRIORITIES.HIGH]: 1,
  [PRIORITIES.MEDIUM]: 2,
  [PRIORITIES.LOW]: 3,
};

export const DEFAULT_PRIORITY = PRIORITIES.MEDIUM;