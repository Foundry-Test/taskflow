import { PRIORITIES, PRIORITY_LABELS, PRIORITY_COLORS, PRIORITY_ORDER, DEFAULT_PRIORITY } from '../constants/priorities';
import { validatePriority, getTasksByPriority, sortTasksByPriority } from '../models/task';

describe('Priority Constants', () => {
  test('PRIORITIES contains High, Medium, and Low values', () => {
    expect(PRIORITIES).toHaveProperty('HIGH');
    expect(PRIORITIES).toHaveProperty('MEDIUM');
    expect(PRIORITIES).toHaveProperty('LOW');
  });

  test('PRIORITIES values are the expected strings', () => {
    expect(PRIORITIES.HIGH).toBe('high');
    expect(PRIORITIES.MEDIUM).toBe('medium');
    expect(PRIORITIES.LOW).toBe('low');
  });

  test('PRIORITY_LABELS contains labels for all priorities', () => {
    expect(PRIORITY_LABELS[PRIORITIES.HIGH]).toBeDefined();
    expect(PRIORITY_LABELS[PRIORITIES.MEDIUM]).toBeDefined();
    expect(PRIORITY_LABELS[PRIORITIES.LOW]).toBeDefined();
  });

  test('PRIORITY_LABELS are human-readable strings', () => {
    expect(typeof PRIORITY_LABELS[PRIORITIES.HIGH]).toBe('string');
    expect(typeof PRIORITY_LABELS[PRIORITIES.MEDIUM]).toBe('string');
    expect(typeof PRIORITY_LABELS[PRIORITIES.LOW]).toBe('string');
    expect(PRIORITY_LABELS[PRIORITIES.HIGH].length).toBeGreaterThan(0);
    expect(PRIORITY_LABELS[PRIORITIES.MEDIUM].length).toBeGreaterThan(0);
    expect(PRIORITY_LABELS[PRIORITIES.LOW].length).toBeGreaterThan(0);
  });

  test('PRIORITY_COLORS contains colors for all priorities', () => {
    expect(PRIORITY_COLORS[PRIORITIES.HIGH]).toBeDefined();
    expect(PRIORITY_COLORS[PRIORITIES.MEDIUM]).toBeDefined();
    expect(PRIORITY_COLORS[PRIORITIES.LOW]).toBeDefined();
  });

  test('PRIORITY_COLORS are valid CSS color strings', () => {
    const colorValues = Object.values(PRIORITY_COLORS);
    colorValues.forEach((color) => {
      expect(typeof color).toBe('string');
      expect(color.length).toBeGreaterThan(0);
    });
  });

  test('PRIORITY_ORDER is an array containing all priorities', () => {
    expect(Array.isArray(PRIORITY_ORDER)).toBe(true);
    expect(PRIORITY_ORDER).toContain(PRIORITIES.HIGH);
    expect(PRIORITY_ORDER).toContain(PRIORITIES.MEDIUM);
    expect(PRIORITY_ORDER).toContain(PRIORITIES.LOW);
    expect(PRIORITY_ORDER.length).toBe(3);
  });

  test('PRIORITY_ORDER has high before medium before low', () => {
    const highIndex = PRIORITY_ORDER.indexOf(PRIORITIES.HIGH);
    const mediumIndex = PRIORITY_ORDER.indexOf(PRIORITIES.MEDIUM);
    const lowIndex = PRIORITY_ORDER.indexOf(PRIORITIES.LOW);
    expect(highIndex).toBeLessThan(mediumIndex);
    expect(mediumIndex).toBeLessThan(lowIndex);
  });

  test('DEFAULT_PRIORITY is one of the valid priorities', () => {
    expect(Object.values(PRIORITIES)).toContain(DEFAULT_PRIORITY);
  });
});

describe('validatePriority', () => {
  test('returns true for valid priority HIGH', () => {
    expect(validatePriority(PRIORITIES.HIGH)).toBe(true);
  });

  test('returns true for valid priority MEDIUM', () => {
    expect(validatePriority(PRIORITIES.MEDIUM)).toBe(true);
  });

  test('returns true for valid priority LOW', () => {
    expect(validatePriority(PRIORITIES.LOW)).toBe(true);
  });

  test('returns false for an invalid priority string', () => {
    expect(validatePriority('critical')).toBe(false);
  });

  test('returns false for null', () => {
    expect(validatePriority(null)).toBe(false);
  });

  test('returns false for undefined', () => {
    expect(validatePriority(undefined)).toBe(false);
  });

  test('returns false for an empty string', () => {
    expect(validatePriority('')).toBe(false);
  });

  test('returns false for a number', () => {
    expect(validatePriority(1)).toBe(false);
  });

  test('is case-sensitive and rejects uppercase input', () => {
    expect(validatePriority('HIGH')).toBe(false);
    expect(validatePriority('MEDIUM')).toBe(false);
    expect(validatePriority('LOW')).toBe(false);
  });
});

describe('getTasksByPriority', () => {
  const tasks = [
    { id: 1, title: 'Task A', priority: PRIORITIES.HIGH },
    { id: 2, title: 'Task B', priority: PRIORITIES.LOW },
    { id: 3, title: 'Task C', priority: PRIORITIES.MEDIUM },
    { id: 4, title: 'Task D', priority: PRIORITIES.HIGH },
    { id: 5, title: 'Task E', priority: PRIORITIES.LOW },
  ];

  test('filters tasks by HIGH priority', () => {
    const result = getTasksByPriority(tasks, PRIORITIES.HIGH);
    expect(result.length).toBe(2);
    result.forEach((task) => {
      expect(task.priority).toBe(PRIORITIES.HIGH);
    });
  });

  test('filters tasks by MEDIUM priority', () => {
    const result = getTasksByPriority(tasks, PRIORITIES.MEDIUM);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(3);
  });

  test('filters tasks by LOW priority', () => {
    const result = getTasksByPriority(tasks, PRIORITIES.LOW);
    expect(result.length).toBe(2);
    result.forEach((task) => {
      expect(task.priority).toBe(PRIORITIES.LOW);
    });
  });

  test('returns an empty array when no tasks match the priority', () => {
    const noHighTasks = [
      { id: 1, title: 'Task A', priority: PRIORITIES.LOW },
      { id: 2, title: 'Task B', priority: PRIORITIES.MEDIUM },
    ];
    const result = getTasksByPriority(noHighTasks, PRIORITIES.HIGH);
    expect(result).toEqual([]);
  });

  test('returns an empty array when given an empty task list', () => {
    const result = getTasksByPriority([], PRIORITIES.HIGH);
    expect(result).toEqual([]);
  });

  test('does not mutate the original tasks array', () => {
    const originalLength = tasks.length;
    getTasksByPriority(tasks, PRIORITIES.HIGH);
    expect(tasks.length).toBe(originalLength);
  });
});

describe('sortTasksByPriority', () => {
  const tasks = [
    { id: 1, title: 'Task A', priority: PRIORITIES.LOW },
    { id: 2, title: 'Task B', priority: PRIORITIES.HIGH },
    { id: 3, title: 'Task C', priority: PRIORITIES.MEDIUM },
    { id: 4, title: 'Task D', priority: PRIORITIES.HIGH },
    { id: 5, title: 'Task E', priority: PRIORITIES.LOW },
  ];

  test('sorts tasks with HIGH priority first', () => {
    const result = sortTasksByPriority(tasks);
    expect(result[0].priority).toBe(PRIORITIES.HIGH);
    expect(result[1].priority).toBe(PRIORITIES.HIGH);
  });

  test('sorts tasks with LOW priority last', () => {
    const result = sortTasksByPriority(tasks);
    expect(result[result.length - 1].priority).toBe(PRIORITIES.LOW);
    expect(result[result.length - 2].priority).toBe(PRIORITIES.LOW);
  });

  test('places MEDIUM priority tasks between HIGH and LOW', () => {
    const result = sortTasksByPriority(tasks);
    const mediumIndex = result.findIndex((t) => t.priority === PRIORITIES.MEDIUM);
    const highIndexes = result
      .map((t, i) => (t.priority === PRIORITIES.HIGH ? i : -1))
      .filter((i) => i !== -1);
    const lowIndexes = result
      .map((t, i) => (t.priority === PRIORITIES.LOW ? i : -1))
      .filter((i) => i !== -1);
    highIndexes.forEach((i) => expect(i).toBeLessThan(mediumIndex));
    lowIndexes.forEach((i) => expect(i).toBeGreaterThan(mediumIndex));
  });

  test('does not mutate the original tasks array', () => {
    const tasksCopy = [...tasks];
    sortTasksByPriority(tasks);
    expect(tasks).toEqual(tasksCopy);
  });

  test('returns an empty array when given an empty task list', () => {
    const result = sortTasksByPriority([]);
    expect(result).toEqual([]);
  });

  test('returns a single-element array unchanged in content', () => {
    const singleTask = [{ id: 1, title: 'Only Task', priority: PRIORITIES.MEDIUM }];
    const result = sortTasksByPriority(singleTask);
    expect(result.length).toBe(1);
    expect(result[0].id).toBe(1);
  });

  test('handles all tasks with the same priority', () => {
    const samePriorityTasks = [
      { id: 1, priority: PRIORITIES.HIGH },
      { id: 2, priority: PRIORITIES.HIGH },
      { id: 3, priority: PRIORITIES.HIGH },
    ];
    const result = sortTasksByPriority(samePriorityTasks);
    expect(result.length).toBe(3);
    result.forEach((task) => {
      expect(task.priority).toBe(PRIORITIES.HIGH);
    });
  });
});