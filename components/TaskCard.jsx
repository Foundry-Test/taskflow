import React from 'react';
import PriorityBadge from './PriorityBadge';

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const { id, title, description, completed, priority, dueDate } = task;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        opacity: completed ? 0.7 : 1,
        transition: 'box-shadow 0.2s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.15)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)')}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        {/* Left: checkbox + content */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
          <input
            type="checkbox"
            checked={completed}
            onChange={() => onToggleComplete && onToggleComplete(id)}
            style={{ marginTop: '3px', width: '18px', height: '18px', cursor: 'pointer', accentColor: '#4a90e2' }}
            aria-label={`Mark "${title}" as ${completed ? 'incomplete' : 'complete'}`}
          />

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '4px' }}>
              <h3
                style={{
                  margin: 0,
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1a1a1a',
                  textDecoration: completed ? 'line-through' : 'none',
                  wordBreak: 'break-word',
                }}
              >
                {title}
              </h3>
              <PriorityBadge priority={priority} />
            </div>

            {description && (
              <p
                style={{
                  margin: '4px 0 0',
                  fontSize: '14px',
                  color: '#555555',
                  lineHeight: '1.5',
                  textDecoration: completed ? 'line-through' : 'none',
                  wordBreak: 'break-word',
                }}
              >
                {description}
              </p>
            )}

            {dueDate && (
              <p style={{ margin: '8px 0 0', fontSize: '12px', color: '#888888' }}>
                <span style={{ marginRight: '4px' }}>📅</span>
                Due: {new Date(dueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            )}
          </div>
        </div>

        {/* Right: action buttons */}
        <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              aria-label={`Edit task "${title}"`}
              style={{
                background: 'none',
                border: '1px solid #c0c0c0',
                borderRadius: '6px',
                padding: '5px 10px',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#444444',
                transition: 'background 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#f0f4ff';
                e.currentTarget.style.borderColor = '#4a90e2';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.borderColor = '#c0c0c0';
              }}
            >
              ✏️ Edit
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(id)}
              aria-label={`Delete task "${title}"`}
              style={{
                background: 'none',
                border: '1px solid #c0c0c0',
                borderRadius: '6px',
                padding: '5px 10px',
                cursor: 'pointer',
                fontSize: '13px',
                color: '#cc3333',
                transition: 'background 0.15s ease, border-color 0.15s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = '#fff0f0';
                e.currentTarget.style.borderColor = '#cc3333';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'none';
                e.currentTarget.style.borderColor = '#c0c0c0';
              }}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;