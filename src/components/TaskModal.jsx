import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlertCircle, FileText, CheckCircle } from 'lucide-react';

export function TaskModal({ isOpen, onClose, onSave, taskToEdit, categories }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Work');
  const [customCategory, setCustomCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setPriority(taskToEdit.priority || 'medium');
      if (categories.includes(taskToEdit.category)) {
        setCategory(taskToEdit.category || 'Work');
        setCustomCategory('');
      } else if (taskToEdit.category) {
        setCategory('custom');
        setCustomCategory(taskToEdit.category);
      } else {
        setCategory('Work');
        setCustomCategory('');
      }
      setDueDate(taskToEdit.dueDate || '');
    } else {
      resetForm();
    }
    setError('');
  }, [taskToEdit, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('Work');
    setCustomCategory('');
    setDueDate('');
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    const finalCategory = category === 'custom' ? customCategory.trim() || 'General' : category;

    onSave({
      id: taskToEdit ? taskToEdit.id : undefined,
      title: title.trim(),
      description: description.trim(),
      priority,
      category: finalCategory,
      dueDate: dueDate || null,
      completed: taskToEdit ? taskToEdit.completed : false,
      createdAt: taskToEdit ? taskToEdit.createdAt : new Date().toISOString()
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-title">
              Task Title <span className="required-star">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              placeholder="e.g. Complete quarterly report presentation"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              className={`form-input ${error ? 'input-error' : ''}`}
              autoFocus
            />
            {error && <span className="error-message"><AlertCircle size={14} /> {error}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="task-description">
              Description <span className="optional-text">(Optional)</span>
            </label>
            <textarea
              id="task-description"
              placeholder="Add key notes, subtasks, or links..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="form-textarea"
            />
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Priority</label>
              <div className="priority-options">
                <button
                  type="button"
                  className={`priority-option-btn priority-low ${priority === 'low' ? 'selected' : ''}`}
                  onClick={() => setPriority('low')}
                >
                  🟢 Low
                </button>
                <button
                  type="button"
                  className={`priority-option-btn priority-medium ${priority === 'medium' ? 'selected' : ''}`}
                  onClick={() => setPriority('medium')}
                >
                  🟡 Medium
                </button>
                <button
                  type="button"
                  className={`priority-option-btn priority-high ${priority === 'high' ? 'selected' : ''}`}
                  onClick={() => setPriority('high')}
                >
                  🔴 High
                </button>
              </div>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="task-category">Category</label>
              <select
                id="task-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-select"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="custom">+ New Category</option>
              </select>

              {category === 'custom' && (
                <input
                  type="text"
                  placeholder="Enter category name"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="form-input custom-cat-input"
                />
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-due-date">
              Due Date <span className="optional-text">(Optional)</span>
            </label>
            <div className="date-input-wrapper">
              <Calendar size={18} className="calendar-icon" />
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-input date-input"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <CheckCircle size={18} />
              <span>{taskToEdit ? 'Save Changes' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
