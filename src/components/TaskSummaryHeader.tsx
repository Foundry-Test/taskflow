import React from 'react';
import { Task } from '../types/task';
import { getTaskStats } from '../utils/taskStats';
import './TaskSummaryHeader.css';

interface TaskSummaryHeaderProps {
  tasks: Task[];
}

const TaskSummaryHeader: React.FC<TaskSummaryHeaderProps> = ({ tasks }) => {
  const stats = getTaskStats(tasks);

  return (
    <header className="task-summary-header">
      <div className="task-summary-header__inner">
        <div className="task-summary-header__title-section">
          <h1 className="task-summary-header__title">Task Dashboard</h1>
          <p className="task-summary-header__subtitle">Your daily task overview</p>
        </div>

        <div className="task-summary-header__stats">
          <div className="task-summary-header__stat-card task-summary-header__stat-card--due-today">
            <div className="task-summary-header__stat-icon" aria-hidden="true">
              📅
            </div>
            <div className="task-summary-header__stat-content">
              <span className="task-summary-header__stat-count">{stats.dueToday}</span>
              <span className="task-summary-header__stat-label">Due Today</span>
            </div>
          </div>

          <div className="task-summary-header__stat-card task-summary-header__stat-card--overdue">
            <div className="task-summary-header__stat-icon" aria-hidden="true">
              ⚠️
            </div>
            <div className="task-summary-header__stat-content">
              <span className="task-summary-header__stat-count">{stats.overdue}</span>
              <span className="task-summary-header__stat-label">Overdue</span>
            </div>
          </div>

          <div className="task-summary-header__stat-card task-summary-header__stat-card--completed">
            <div className="task-summary-header__stat-icon" aria-hidden="true">
              ✅
            </div>
            <div className="task-summary-header__stat-content">
              <span className="task-summary-header__stat-count">{stats.completedThisWeek}</span>
              <span className="task-summary-header__stat-label">Completed This Week</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TaskSummaryHeader;