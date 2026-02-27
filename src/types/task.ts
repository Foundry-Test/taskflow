export type TaskStatus = 'pending' | 'completed' | 'overdue';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  status: TaskStatus;
  completedAt?: Date;
  createdAt: Date;
}