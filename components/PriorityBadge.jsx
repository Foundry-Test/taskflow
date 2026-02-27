import React from 'react';
import { PRIORITIES } from '../constants/priorities';

const PriorityBadge = ({ priority }) => {
  const priorityConfig = PRIORITIES[priority];

  if (!priorityConfig) {
    return null;
  }

  const badgeStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    letterSpacing: '0.3px',
    backgroundColor: priorityConfig.backgroundColor,
    color: priorityConfig.textColor,
    border: `1px solid ${priorityConfig.borderColor}`,
    userSelect: 'none',
  };

  const dotStyles = {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: priorityConfig.dotColor,
    flexShrink: 0,
  };

  return (
    <span style={badgeStyles} aria-label={`Priority: ${priorityConfig.label}`}>
      <span style={dotStyles} aria-hidden="true" />
      {priorityConfig.icon && (
        <span aria-hidden="true">{priorityConfig.icon}</span>
      )}
      {priorityConfig.label}
    </span>
  );
};

export default PriorityBadge;