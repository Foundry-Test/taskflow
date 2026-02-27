import React from 'react';
import DueDateSummary from '../components/DueDateSummary';

const sampleTasks = [
  {
    id: 1,
    title: 'Submit quarterly report',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
  },
  {
    id: 2,
    title: 'Team standup meeting',
    dueDate: new Date().toISOString(),
    completed: false,
  },
  {
    id: 3,
    title: 'Review pull requests',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
  },
  {
    id: 4,
    title: 'Update project documentation',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
  },
  {
    id: 5,
    title: 'Deploy hotfix',
    dueDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
  },
  {
    id: 6,
    title: 'Onboarding call',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    completed: false,
  },
  {
    id: 7,
    title: 'Archive old files',
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    completed: true,
  },
];

const Dashboard = () => {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div>
            <h1 style={styles.heading}>Dashboard</h1>
            <p style={styles.subheading}>Welcome back! Here's what's on your plate.</p>
          </div>
        </div>
        <DueDateSummary tasks={sampleTasks} />
      </header>

      <main style={styles.main}>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>All Tasks</h2>
          <ul style={styles.taskList}>
            {sampleTasks.map((task) => (
              <li key={task.id} style={styles.taskItem}>
                <div style={styles.taskLeft}>
                  <span
                    style={{
                      ...styles.taskDot,
                      backgroundColor: task.completed ? '#22c55e' : '#6366f1',
                    }}
                  />
                  <span
                    style={{
                      ...styles.taskTitle,
                      textDecoration: task.completed ? 'line-through' : 'none',
                      color: task.completed ? '#9ca3af' : '#1f2937',
                    }}
                  >
                    {task.title}
                  </span>
                </div>
                <span style={styles.taskDate}>
                  {new Date(task.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#f5f5f5',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    backgroundColor: '#ffffff',
    padding: '28px 32px 0 32px',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  headerTop: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  heading: {
    margin: 0,
    fontSize: '26px',
    fontWeight: '700',
    color: '#111827',
  },
  subheading: {
    margin: '4px 0 0 0',
    fontSize: '14px',
    color: '#6b7280',
  },
  main: {
    padding: '32px',
  },
  section: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  sectionTitle: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
  },
  taskList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  taskItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
  },
  taskLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  taskDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  taskTitle: {
    fontSize: '15px',
    fontWeight: '500',
  },
  taskDate: {
    fontSize: '13px',
    color: '#6b7280',
    whiteSpace: 'nowrap',
  },
};

export default Dashboard;