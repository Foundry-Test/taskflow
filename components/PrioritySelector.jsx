import React from 'react';
import { PRIORITIES, PRIORITY_CONFIG } from '../constants/priorities';

const PrioritySelector = ({ value, onChange, disabled = false }) => {
  return (
    <div className="priority-selector">
      <label
        htmlFor="priority-select"
        style={{
          display: 'block',
          marginBottom: '6px',
          fontSize: '14px',
          fontWeight: '500',
          color: '#374151',
        }}
      >
        Priority
      </label>
      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
        <select
          id="priority-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          style={{
            width: '100%',
            padding: '8px 36px 8px 12px',
            fontSize: '14px',
            fontWeight: '500',
            color: PRIORITY_CONFIG[value]?.textColor || '#374151',
            backgroundColor: PRIORITY_CONFIG[value]?.bgColor || '#f3f4f6',
            border: `2px solid ${PRIORITY_CONFIG[value]?.borderColor || '#d1d5db'}`,
            borderRadius: '8px',
            appearance: 'none',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            outline: 'none',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
            opacity: disabled ? 0.6 : 1,
          }}
          onFocus={(e) => {
            e.target.style.boxShadow = `0 0 0 3px ${PRIORITY_CONFIG[value]?.shadowColor || 'rgba(107, 114, 128, 0.3)'}`;
          }}
          onBlur={(e) => {
            e.target.style.boxShadow = 'none';
          }}
          aria-label="Select task priority"
        >
          {PRIORITIES.map((priority) => {
            const config = PRIORITY_CONFIG[priority];
            return (
              <option
                key={priority}
                value={priority}
                style={{
                  color: config.textColor,
                  backgroundColor: '#ffffff',
                  fontWeight: '500',
                }}
              >
                {config.icon} {config.label}
              </option>
            );
          })}
        </select>

        <div
          style={{
            position: 'absolute',
            right: '10px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: PRIORITY_CONFIG[value]?.textColor || '#374151',
            fontSize: '12px',
          }}
          aria-hidden="true"
        >
          ▼
        </div>
      </div>

      <div
        style={{
          marginTop: '8px',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
        }}
      >
        {PRIORITIES.map((priority) => {
          const config = PRIORITY_CONFIG[priority];
          const isSelected = value === priority;
          return (
            <button
              key={priority}
              type="button"
              onClick={() => !disabled && onChange(priority)}
              disabled={disabled}
              aria-pressed={isSelected}
              aria-label={`Set priority to ${config.label}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                fontSize: '12px',
                fontWeight: isSelected ? '700' : '500',
                color: config.textColor,
                backgroundColor: isSelected ? config.bgColor : '#ffffff',
                border: `2px solid ${isSelected ? config.borderColor : '#e5e7eb'}`,
                borderRadius: '20px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                outline: 'none',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? `0 2px 4px ${config.shadowColor}` : 'none',
                opacity: disabled ? 0.6 : 1,
                transform: isSelected ? 'scale(1.05)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (!disabled && !isSelected) {
                  e.currentTarget.style.backgroundColor = config.bgColor;
                  e.currentTarget.style.borderColor = config.borderColor;
                }
              }}
              onMouseLeave={(e) => {
                if (!disabled && !isSelected) {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }
              }}
            >
              <span aria-hidden="true">{config.icon}</span>
              {config.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PrioritySelector;