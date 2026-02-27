import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import { isOverdue, isDueSoon } from '../utils/dateUtils';
import '../styles/tasks.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        throw new Error('Failed to create task');
      }
      const newTask = await response.json();
      setTasks((prev) => [newTask, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      const updatedTask = await response.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
      setEditingTask(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleComplete = async (taskId, completed) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }),
      });
      if (!response.ok) {
        throw new Error('Failed to update task status');
      }
      const updatedTask = await response.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? updatedTask : task))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(false);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case 'overdue':
        return tasks.filter(
          (task) => !task.completed && isOverdue(task.due_date)
        );
      case 'due_soon':
        return tasks.filter(
          (task) => !task.completed && isDueSoon(task.due_date)
        );
      case 'completed':
        return tasks.filter((task) => task.completed);
      case 'pending':
        return tasks.filter((task) => !task.completed);
      case 'all':
      default:
        return tasks;
    }
  };

  const getOverdueCount = () =>
    tasks.filter((task) => !task.completed && isOverdue(task.due_date)).length;

  const getDueSoonCount = () =>
    tasks.filter((task) => !task.completed && isDueSoon(task.due_date)).length;

  const filteredTasks = getFilteredTasks();
  const overdueCount = getOverdueCount();
  const dueSoonCount = getDueSoonCount();

  if (loading) {
    return (
      <div className="task-list-loading">
        <div className="loading-spinner" />
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="task-list-container">
      <div className="task-list-header">
        <h1 className="task-list-title">Tasks</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setShowForm(true);
            setEditingTask(null);
          }}
        >
          + New Task
        </button>
      </div>

      {error && (
        <div className="task-error-banner">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="error-dismiss">
            &times;
          </button>
        </div>
      )}

      {(overdueCount > 0 || dueSoonCount > 0) && (
        <div className="task-alerts">
          {overdueCount > 0 && (
            <div className="task-alert task-alert-overdue">
              <span className="alert-icon">⚠️</span>
              <span>
                {overdueCount} task{overdueCount !== 1 ? 's are' : ' is'} overdue
              </span>
              <button
                className="alert-filter-btn"
                onClick={() => setFilter('overdue')}
              >
                View
              </button>
            </div>
          )}
          {dueSoonCount > 0 && (
            <div className="task-alert task-alert-due-soon">
              <span className="alert-icon">🕐</span>
              <span>
                {dueSoonCount} task{dueSoonCount !== 1 ? 's are' : ' is'} due
                soon
              </span>
              <button
                className="alert-filter-btn"
                onClick={() => setFilter('due_soon')}
              >
                View
              </button>
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="task-form-wrapper">
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={handleCancelForm}
            title="Create New Task"
          />
        </div>
      )}

      <div className="task-filter-bar">
        {['all', 'pending', 'overdue', 'due_soon', 'completed'].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'due_soon'
              ? 'Due Soon'
              : f.charAt(0).toUpperCase() + f.slice(1)}
            {f === 'overdue' && overdueCount > 0 && (
              <span className="filter-badge filter-badge-overdue">
                {overdueCount}
              </span>
            )}
            {f === 'due_soon' && dueSoonCount > 0 && (
              <span className="filter-badge filter-badge-due-soon">
                {dueSoonCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {filteredTasks.length === 0 ? (
        <div className="task-empty-state">
          <div className="empty-state-icon">📋</div>
          <p className="empty-state-message">
            {filter === 'all'
              ? 'No tasks yet. Create your first task!'
              : filter === 'overdue'
              ? 'No overdue tasks. Great job!'
              : filter === 'due_soon'
              ? 'No tasks due soon.'
              : filter === 'completed'
              ? 'No completed tasks yet.'
              : 'No pending tasks.'}
          </p>
          {filter === 'all' && (
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Create Task
            </button>
          )}
        </div>
      ) : (
        <div className="task-list">
          {filteredTasks.map((task) => (
            <React.Fragment key={task.id}>
              {editingTask && editingTask.id === task.id ? (
                <div className="task-form-wrapper task-form-inline">
                  <TaskForm
                    initialData={editingTask}
                    onSubmit={(data) => handleUpdateTask(task.id, data)}
                    onCancel={handleCancelForm}
                    title="Edit Task"
                  />
                </div>
              ) : (
                <TaskCard
                  task={task}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onToggleComplete={handleToggleComplete}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      <div className="task-list-footer">
        <span className="task-count">
          Showing {filteredTasks.length} of {tasks.length} task
          {tasks.length !== 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

export default TaskList;