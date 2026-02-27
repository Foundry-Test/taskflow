import React from 'react';

const DueDateSummary = ({ tasks = [] }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const overdueTasks = tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false;
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  });

  const dueTodayTasks = tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false;
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
  });

  const dueTomorrowTasks = tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false;
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === tomorrow.getTime();
  });

  const dueThisWeekTasks = tasks.filter((task) => {
    if (!task.dueDate || task.completed) return false;
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due > tomorrow && due <= nextWeek;
  });

  const summaryItems = [
    {
      label: 'Overdue',
      count: overdueTasks.length,
      color: '#dc2626',
      bgColor: '#fef2f2',
      borderColor: '#fecaca',
      icon: '⚠️',
    },
    {
      label: 'Due Today',
      count: dueTodayTasks.length,
      color: '#d97706',
      bgColor: '#fffbeb',
      borderColor: '#fde68a',
      icon: '📅',
    },
    {
      label: 'Due Tomorrow',
      count: dueTomorrowTasks.length,
      color: '#2563eb',
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe',
      icon: '🗓️',
    },
    {
      label: 'This Week',
      count: dueThisWeekTasks.length,
      color: '#059669',
      bgColor: '#f0fdf4',
      borderColor: '#bbf7d0',
      icon: '📆',
    },
  ];

  const totalPending = overdueTasks.length + dueTodayTasks.length + dueTomorrowTasks.length + dueThisWeekTasks.length;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Due Date Summary</h2>
        {totalPending > 0 && (
          <span style={styles.totalBadge}>
            {totalPending} task{totalPending !== 1 ? 's' : ''} upcoming
          </span>
        )}
        {totalPending === 0 && (
          <span style={styles.allClearBadge}>All clear! 🎉</span>
        )}
      </div>

      <div style={styles.grid}>
        {summaryItems.map((item) => (
          <div
            key={item.label}
            style={{
              ...styles.card,
              backgroundColor: item.bgColor,
              borderColor: item.borderColor,
            }}
          >
            <div style={styles.cardTop}>
              <span style={styles.cardIcon}>{item.icon}</span>
              <span
                style={{
                  ...styles.cardCount,
                  color: item.color,
                }}
              >
                {item.count}
              </span>
            </div>
            <p
              style={{
                ...styles.cardLabel,
                color: item.color,
              }}
            >
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {overdueTasks.length > 0 && (
        <div style={styles.overdueSection}>
          <h3 style={styles.overdueTitle}>⚠️ Overdue Tasks</h3>
          <ul style={styles.taskList}>
            {overdueTasks.map((task) => (
              <li key={task.id} style={styles.taskItem}>
                <span style={styles.taskName}>{task.name || task.title}</span>
                <span style={styles.taskDueDate}>
                  Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {dueTodayTasks.length > 0 && (
        <div style={styles.todaySection}>
          <h3 style={styles.todayTitle}>📅 Due Today</h3>
          <ul style={styles.taskList}>
            {dueTodayTasks.map((task) => (
              <li key={task.id} style={styles.taskItem}>
                <span style={styles.taskName}>{task.name || task.title}</span>
                <span style={{ ...styles.taskDueDate, color: '#d97706' }}>
                  Today
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
    marginBottom: '24px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px',
  },
  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1f2937',
    margin: 0,
  },
  totalBadge: {
    backgroundColor: '#f3f4f6',
    color: '#374151',
    fontSize: '13px',
    fontWeight: '500',
    padding: '4px 12px',
    borderRadius: '20px',
    border: '1px solid #e5e7eb',
  },
  allClearBadge: {
    backgroundColor: '#f0fdf4',
    color: '#059669',
    fontSize: '13px',
    fontWeight: '500',
    padding: '4px 12px',
    borderRadius: '20px',
    border: '1px solid #bbf7d0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
  },
  card: {
    borderRadius: '10px',
    padding: '16px',
    border: '1px solid',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    cursor: 'default',
  },
  cardTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  cardIcon: {
    fontSize: '20px',
  },
  cardCount: {
    fontSize: '28px',
    fontWeight: '800',
    lineHeight: '1',
  },
  cardLabel: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    margin: 0,
    textAlign: 'center',
  },
  overdueSection: {
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '12px',
  },
  overdueTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#dc2626',
    margin: '0 0 12px 0',
  },
  todaySection: {
    backgroundColor: '#fffbeb',
    border: '1px solid #fde68a',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '12px',
  },
  todayTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#d97706',
    margin: '0 0 12px 0',
  },
  taskList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  taskItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    padding: '8px 12px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  taskName: {
    fontSize: '14px',
    color: '#1f2937',
    fontWeight: '500',
  },
  taskDueDate: {
    fontSize: '12px',
    color: '#dc2626',
    fontWeight: '500',
  },
};

export default DueDateSummary;