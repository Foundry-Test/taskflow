import React from 'react';
import { formatDueDate, isOverdue, isDueSoon } from '../utils/dateUtils';
import '../styles/tasks.css';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const overdue = task.due_date && !task.completed && isOverdue(task.due_date);
  const dueSoon = task.due_date && !task.completed && !overdue && isDueSoon(task.due_date);

  const cardClasses = [
    'task-card',
    task.completed ? 'task-card--completed' : '',
    overdue ? 'task-card--overdue' : '',
    dueSoon ? 'task-card--due-soon' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses}>
      <div className="task-card__header">
        <div className="task-card__title-section">
          <input
            type="checkbox"
            className="task-card__checkbox"
            checked={task.completed || false}
            onChange={() => onToggleComplete && onToggleComplete(task.id, !task.completed)}
            aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
          />
          <h3 className={`task-card__title ${task.completed ? 'task-card__title--completed' : ''}`}>
            {task.title}
          </h3>
        </div>

        <div className="task-card__actions">
          {onEdit && (
            <button
              className="task-card__btn task-card__btn--edit"
              onClick={() => onEdit(task)}
              aria-label={`Edit task "${task.title}"`}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              className="task-card__btn task-card__btn--delete"
              onClick={() => onDelete(task.id)}
              aria-label={`Delete task "${task.title}"`}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      <div className="task-card__footer">
        {task.due_date && (
          <div
            className={[
              'task-card__due-date',
              overdue ? 'task-card__due-date--overdue' : '',
              dueSoon ? 'task-card__due-date--due-soon' : '',
              task.completed ? 'task-card__due-date--completed' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <span className="task-card__due-date-icon" aria-hidden="true">
              {overdue ? '⚠️' : dueSoon ? '🕐' : '📅'}
            </span>
            <span className="task-card__due-date-label">
              {overdue && !task.completed ? 'Overdue: ' : 'Due: '}
            </span>
            <span className="task-card__due-date-value">
              {formatDueDate(task.due_date)}
            </span>
          </div>
        )}

        {task.priority && (
          <div className={`task-card__priority task-card__priority--${task.priority.toLowerCase()}`}>
            {task.priority}
          </div>
        )}

        {task.completed && (
          <div className="task-card__completed-badge">✓ Completed</div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;