import React, { useState } from 'react';
import '../styles/tasks.css';

const TaskForm = ({ onSubmit, initialData = {}, onCancel }) => {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    status: initialData.status || 'todo',
    priority: initialData.priority || 'medium',
    due_date: initialData.due_date ? initialData.due_date.split('T')[0] : '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    }
    if (formData.due_date && formData.due_date < today) {
      newErrors.due_date = 'Due date is in the past. This task will be marked as overdue.';
    }
    setErrors(newErrors);
    return !newErrors.title;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      due_date: formData.due_date || null,
    };

    onSubmit(payload);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="task-form__group">
        <label className="task-form__label" htmlFor="title">
          Title <span className="task-form__required">*</span>
        </label>
        <input
          id="title"
          name="title"
          type="text"
          className={`task-form__input ${errors.title ? 'task-form__input--error' : ''}`}
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
        />
        {errors.title && (
          <span className="task-form__error-message">{errors.title}</span>
        )}
      </div>

      <div className="task-form__group">
        <label className="task-form__label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="task-form__textarea"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description (optional)"
          rows={4}
        />
      </div>

      <div className="task-form__row">
        <div className="task-form__group task-form__group--half">
          <label className="task-form__label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="task-form__select"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>

        <div className="task-form__group task-form__group--half">
          <label className="task-form__label" htmlFor="priority">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            className="task-form__select"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="task-form__group">
        <label className="task-form__label" htmlFor="due_date">
          Due Date
        </label>
        <input
          id="due_date"
          name="due_date"
          type="date"
          className={`task-form__input task-form__input--date ${
            errors.due_date ? 'task-form__input--warning' : ''
          }`}
          value={formData.due_date}
          onChange={handleChange}
        />
        {errors.due_date && (
          <span className="task-form__warning-message">{errors.due_date}</span>
        )}
        <span className="task-form__hint">
          Leave blank if there is no due date.
        </span>
      </div>

      <div className="task-form__actions">
        {onCancel && (
          <button
            type="button"
            className="task-form__button task-form__button--cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="task-form__button task-form__button--submit"
        >
          {initialData.id ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;