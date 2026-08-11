import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlertCircle, Check, Clock } from 'lucide-react';

export function TaskModal({ isOpen, onClose, onSave, taskToEdit, categories }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Work');
  const [customCategory, setCustomCategory] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
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
      setEstimatedTime(taskToEdit.estimatedTime || '');
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
    setEstimatedTime('');
    setError('');
  };

  const handleQuickDate = (preset) => {
    const today = new Date();
    if (preset === 'today') {
      setDueDate(today.toISOString().split('T')[0]);
    } else if (preset === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
    } else if (preset === 'next-week') {
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      setDueDate(nextWeek.toISOString().split('T')[0]);
    }
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
      estimatedTime: estimatedTime || null,
      completed: taskToEdit ? taskToEdit.completed : false,
      pinned: taskToEdit ? taskToEdit.pinned : false,
      subtasks: taskToEdit ? taskToEdit.subtasks || [] : [],
      createdAt: taskToEdit ? taskToEdit.createdAt : new Date().toISOString()
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{taskToEdit ? 'Edit task' : 'New task'}</h2>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="task-title">What needs to be done?</label>
            <input
              id="task-title"
              type="text"
              placeholder="Task title..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (e.target.value.trim()) setError('');
              }}
              className={`form-input ${error ? 'input-error' : ''}`}
              autoFocus
            />
            {error && <span className="error-message"><AlertCircle size={13} /> {error}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="task-description">Notes or details <span className="optional">(optional)</span></label>
            <textarea
              id="task-description"
              placeholder="Add extra context or notes..."
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
                  className={`priority-btn priority-low ${priority === 'low' ? 'selected' : ''}`}
                  onClick={() => setPriority('low')}
                >
                  Low
                </button>
                <button
                  type="button"
                  className={`priority-btn priority-medium ${priority === 'medium' ? 'selected' : ''}`}
                  onClick={() => setPriority('medium')}
                >
                  Medium
                </button>
                <button
                  type="button"
                  className={`priority-btn priority-high ${priority === 'high' ? 'selected' : ''}`}
                  onClick={() => setPriority('high')}
                >
                  High
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
                  placeholder="Category name"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="form-input custom-cat-input"
                />
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label htmlFor="task-due-date">Due date</label>
              <div className="date-field-wrapper">
                <Calendar size={14} className="calendar-icon" />
                <input
                  id="task-due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="form-input date-input"
                />
              </div>
            </div>

            <div className="form-group flex-1">
              <label htmlFor="task-est-time">Est. Time</label>
              <select
                id="task-est-time"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                className="form-select"
              >
                <option value="">No Estimate</option>
                <option value="15 min">15 mins</option>
                <option value="30 min">30 mins</option>
                <option value="45 min">45 mins</option>
                <option value="1 hr">1 hour</option>
                <option value="2 hrs">2 hours</option>
              </select>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              <Check size={16} />
              <span>{taskToEdit ? 'Save Changes' : 'Add Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
