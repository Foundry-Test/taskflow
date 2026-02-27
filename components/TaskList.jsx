import React, { useState, useMemo } from 'react';
import TaskCard from './TaskCard';
import { PRIORITIES, PRIORITY_LABELS } from '../constants/priorities';

const ALL_FILTER = 'ALL';

const filterOptions = [
  { value: ALL_FILTER, label: 'All Priorities' },
  { value: PRIORITIES.HIGH, label: PRIORITY_LABELS[PRIORITIES.HIGH] },
  { value: PRIORITIES.MEDIUM, label: PRIORITY_LABELS[PRIORITIES.MEDIUM] },
  { value: PRIORITIES.LOW, label: PRIORITY_LABELS[PRIORITIES.LOW] },
];

const TaskList = ({ tasks = [], onEditTask, onDeleteTask, onToggleComplete }) => {
  const [selectedPriority, setSelectedPriority] = useState(ALL_FILTER);

  const filteredTasks = useMemo(() => {
    if (selectedPriority === ALL_FILTER) {
      return tasks;
    }
    return tasks.filter((task) => task.priority === selectedPriority);
  }, [tasks, selectedPriority]);

  const taskCounts = useMemo(() => {
    const counts = { [ALL_FILTER]: tasks.length };
    Object.values(PRIORITIES).forEach((priority) => {
      counts[priority] = tasks.filter((t) => t.priority === priority).length;
    });
    return counts;
  }, [tasks]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Tasks</h2>
        <span style={styles.totalCount}>
          {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      <div style={styles.filterBar}>
        <span style={styles.filterLabel}>Filter by priority:</span>
        <div style={styles.filterButtons}>
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedPriority(option.value)}
              style={{
                ...styles.filterButton,
                ...(selectedPriority === option.value ? styles.filterButtonActive : {}),
              }}
              aria-pressed={selectedPriority === option.value}
            >
              {option.label}
              <span
                style={{
                  ...styles.filterCount,
                  ...(selectedPriority === option.value ? styles.filterCountActive : {}),
                }}
              >
                {taskCounts[option.value] ?? 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div style={styles.emptyState}>
          {tasks.length === 0 ? (
            <>
              <div style={styles.emptyIcon}>📋</div>
              <p style={styles.emptyTitle}>No tasks yet</p>
              <p style={styles.emptySubtitle}>Create your first task to get started.</p>
            </>
          ) : (
            <>
              <div style={styles.emptyIcon}>🔍</div>
              <p style={styles.emptyTitle}>No tasks match this filter</p>
              <p style={styles.emptySubtitle}>
                There are no {PRIORITY_LABELS[selectedPriority]?.toLowerCase()} priority tasks.
              </p>
              <button
                style={styles.clearFilterButton}
                onClick={() => setSelectedPriority(ALL_FILTER)}
              >
                Clear filter
              </button>
            </>
          )}
        </div>
      ) : (
        <div style={styles.list}>
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </div>
      )}

      {filteredTasks.length > 0 && selectedPriority !== ALL_FILTER && (
        <div style={styles.filterFooter}>
          <span style={styles.filterFooterText}>
            Showing {filteredTasks.length} of {tasks.length} tasks
          </span>
          <button
            style={styles.clearFilterLink}
            onClick={() => setSelectedPriority(ALL_FILTER)}
          >
            Show all
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '800px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  title: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: 0,
  },
  totalCount: {
    fontSize: '14px',
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: '500',
  },
  filterBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    backgroundColor: '#f9fafb',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
  },
  filterLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    whiteSpace: 'nowrap',
  },
  filterButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1.5px solid #d1d5db',
    backgroundColor: '#ffffff',
    color: '#374151',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
  },
  filterButtonActive: {
    backgroundColor: '#4f46e5',
    borderColor: '#4f46e5',
    color: '#ffffff',
  },
  filterCount: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '18px',
    height: '18px',
    padding: '0 5px',
    borderRadius: '9px',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    fontSize: '11px',
    fontWeight: '700',
  },
  filterCountActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    color: '#ffffff',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 24px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    border: '2px dashed #e5e7eb',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#374151',
    margin: '0 0 8px 0',
  },
  emptySubtitle: {
    fontSize: '14px',
    color: '#9ca3af',
    margin: '0 0 20px 0',
  },
  clearFilterButton: {
    padding: '8px 20px',
    borderRadius: '8px',
    border: '1.5px solid #4f46e5',
    backgroundColor: '#ffffff',
    color: '#4f46e5',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  filterFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: '1px solid #e5e7eb',
  },
  filterFooterText: {
    fontSize: '13px',
    color: '#9ca3af',
  },
  clearFilterLink: {
    background: 'none',
    border: 'none',
    color: '#4f46e5',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '0',
    textDecoration: 'underline',
  },
};

export default TaskList;