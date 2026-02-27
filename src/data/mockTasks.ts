import { Task } from '../types/task';

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(today.getDate() - 1);

const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(today.getDate() - 2);

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(today.getDate() - 3);

const fiveDaysAgo = new Date(today);
fiveDaysAgo.setDate(today.getDate() - 5);

const formatDate = (date: Date): string => date.toISOString().split('T')[0];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Review project proposal',
    dueDate: formatDate(today),
    completed: false,
    completedAt: undefined,
  },
  {
    id: '2',
    title: 'Send weekly report',
    dueDate: formatDate(today),
    completed: false,
    completedAt: undefined,
  },
  {
    id: '3',
    title: 'Team standup meeting',
    dueDate: formatDate(today),
    completed: true,
    completedAt: formatDate(today),
  },
  {
    id: '4',
    title: 'Update documentation',
    dueDate: formatDate(yesterday),
    completed: false,
    completedAt: undefined,
  },
  {
    id: '5',
    title: 'Fix login bug',
    dueDate: formatDate(twoDaysAgo),
    completed: false,
    completedAt: undefined,
  },
  {
    id: '6',
    title: 'Deploy to staging',
    dueDate: formatDate(threeDaysAgo),
    completed: false,
    completedAt: undefined,
  },
  {
    id: '7',
    title: 'Client call preparation',
    dueDate: formatDate(tomorrow),
    completed: false,
    completedAt: undefined,
  },
  {
    id: '8',
    title: 'Code review for PR #42',
    dueDate: formatDate(yesterday),
    completed: true,
    completedAt: formatDate(yesterday),
  },
  {
    id: '9',
    title: 'Write unit tests',
    dueDate: formatDate(twoDaysAgo),
    completed: true,
    completedAt: formatDate(twoDaysAgo),
  },
  {
    id: '10',
    title: 'Refactor authentication module',
    dueDate: formatDate(fiveDaysAgo),
    completed: true,
    completedAt: formatDate(fiveDaysAgo),
  },
  {
    id: '11',
    title: 'Design new dashboard layout',
    dueDate: formatDate(threeDaysAgo),
    completed: true,
    completedAt: formatDate(threeDaysAgo),
  },
  {
    id: '12',
    title: 'Set up CI/CD pipeline',
    dueDate: formatDate(tomorrow),
    completed: false,
    completedAt: undefined,
  },
];