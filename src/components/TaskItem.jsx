import React, { useState } from 'react';
import { Check, Edit2, Trash2, Calendar, Tag, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));

  const priorityLabels = {
    high: { label: 'High', class: 'priority-tag-high' },
    medium: { label: 'Medium', class: 'priority-tag-medium' },
    low: { label: 'Low', class: 'priority-tag-low' },
  };

  const currentPriority = priorityLabels[task.priority] || priorityLabels.medium;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className={`task-item-card ${task.completed ? 'completed' : ''} ${isOverdue ? 'overdue-card' : ''}`}>
      <div className="task-item-main">
        <label className="checkbox-container" title={task.completed ? "Mark as pending" : "Mark as completed"}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
          />
          <span className="checkbox-custom">
            {task.completed && <Check size={14} strokeWidth={3} />}
          </span>
        </label>

        <div className="task-content">
          <div className="task-header-row">
            <h3 className={`task-title ${task.completed ? 'completed-text' : ''}`}>
              {task.title}
            </h3>
          </div>

          <div className="task-meta-row">
            <span className={`priority-badge ${currentPriority.class}`}>
              <span className="priority-dot" />
              {currentPriority.label}
            </span>

            {task.category && (
              <span className="category-pill">
                <Tag size={12} />
                {task.category}
              </span>
            )}

            {task.dueDate && (
              <span className={`date-badge-item ${isOverdue ? 'overdue-text' : ''}`}>
                {isOverdue ? <AlertCircle size={12} /> : <Calendar size={12} />}
                {formatDate(task.dueDate)} {isOverdue && '(Overdue)'}
              </span>
            )}
          </div>

          {task.description && (
            <div className={`task-description-wrapper ${isExpanded ? 'expanded' : ''}`}>
              <p className="task-description">{task.description}</p>
            </div>
          )}
        </div>

        <div className="task-actions">
          {task.description && task.description.length > 50 && (
            <button
              className="action-icon-btn expand-btn"
              onClick={() => setIsExpanded(!isExpanded)}
              title={isExpanded ? "Collapse" : "Read more"}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}

          <button
            className="action-icon-btn edit-btn"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label="Edit task"
          >
            <Edit2 size={16} />
          </button>

          <button
            className="action-icon-btn delete-btn"
            onClick={() => setShowConfirmDelete(true)}
            title="Delete task"
            aria-label="Delete task"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {showConfirmDelete && (
        <div className="inline-confirm-delete">
          <span>Delete this task?</span>
          <div className="confirm-btns">
            <button 
              className="confirm-yes-btn"
              onClick={() => {
                setShowConfirmDelete(false);
                onDelete(task.id);
              }}
            >
              Yes, Delete
            </button>
            <button 
              className="confirm-cancel-btn"
              onClick={() => setShowConfirmDelete(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
