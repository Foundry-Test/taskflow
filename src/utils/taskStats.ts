import { Task } from '../types/task';

export function getDueToday(tasks: Task[]): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false;
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due >= today && due < tomorrow;
  });
}

export function getOverdue(tasks: Task[]): Task[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false;
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  });
}

export function getCompletedThisWeek(tasks: Task[]): Task[] {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - dayOfWeek);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return tasks.filter((task) => {
    if (!task.completed || !task.completedAt) return false;
    const completedAt = new Date(task.completedAt);
    return completedAt >= startOfWeek && completedAt < endOfWeek;
  });
}

export function getTaskStats(tasks: Task[]) {
  return {
    dueToday: getDueToday(tasks).length,
    overdue: getOverdue(tasks).length,
    completedThisWeek: getCompletedThisWeek(tasks).length,
  };
}