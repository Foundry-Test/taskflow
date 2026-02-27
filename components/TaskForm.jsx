import React, { useState } from 'react';
import PrioritySelector from './PrioritySelector';
import { PRIORITIES, DEFAULT_PRIORITY } from '../constants/priorities';

const TaskForm = ({ onSubmit, initialValues = {}, submitLabel = 'Add Task' }) => {
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [priority, setPriority] = useState(initialValues.priority || DEFAULT_PRIORITY);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Title is required.';
    }
    if (!Object.values(PRIORITIES).includes(priority)) {
      newErrors.priority = 'Please select a valid priority.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit({ title: title.trim(), description: description.trim(), priority });
    if (!initialValues.title) {
      setTitle('');
      setDescription('');
      setPriority(DEFAULT_PRIORITY);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form} noValidate>
      <div style={styles.fieldGroup}>
        <label htmlFor="task-title" style={styles.label}>
          Title <span style={styles.required}>*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          style={{
            ...styles.input,
            ...(errors.title ? styles.inputError : {}),
          }}
          aria-describedby={errors.title ? 'title-error' : undefined}
          aria-invalid={!!errors.title}
        />
        {errors.title && (
          <span id="title-error" style={styles.errorText} role="alert">
            {errors.title}
          </span>
        )}
      </div>

      <div style={styles.fieldGroup}>
        <label htmlFor="task-description" style={styles.label}>
          Description
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          rows={3}
          style={styles.textarea}
        />
      </div>

      <div style={styles.fieldGroup}>
        <label style={styles.label}>
          Priority <span style={styles.required}>*</span>
        </label>
        <PrioritySelector
          value={priority}
          onChange={setPriority}
          aria-describedby={errors.priority ? 'priority-error' : undefined}
        />
        {errors.priority && (
          <span id="priority-error" style={styles.errorText} role="alert">
            {errors.priority}
          </span>
        )}
      </div>

      <button type="submit" style={styles.submitButton}>
        {submitLabel}
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
    maxWidth: '520px',
    width: '100%',
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333333',
  },
  required: {
    color: '#e53e3e',
    marginLeft: '2px',
  },
  input: {
    padding: '9px 12px',
    fontSize: '14px',
    color: '#333333',
    backgroundColor: '#f9f9f9',
    border: '1px solid #cccccc',
    borderRadius: '6px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },
  inputError: {
    borderColor: '#e53e3e',
    backgroundColor: '#fff5f5',
  },
  textarea: {
    padding: '9px 12px',
    fontSize: '14px',
    color: '#333333',
    backgroundColor: '#f9f9f9',
    border: '1px solid #cccccc',
    borderRadius: '6px',
    outline: 'none',
    resize: 'vertical',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.2s',
  },
  errorText: {
    fontSize: '12px',
    color: '#e53e3e',
    marginTop: '2px',
  },
  submitButton: {
    marginTop: '4px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#ffffff',
    backgroundColor: '#4a6cf7',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    alignSelf: 'flex-start',
    transition: 'background-color 0.2s',
  },
};

export default TaskForm;