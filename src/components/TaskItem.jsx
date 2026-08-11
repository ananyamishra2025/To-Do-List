import React, { useState } from 'react';
import { Check, Edit2, Trash2, Calendar, Tag, AlertCircle, Pin, Plus, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { playPopSound, triggerParticleBurst } from '../utils/audioAndCanvas';

export function TaskItem({ 
  task, 
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onTogglePin,
  onToggleSubtask,
  onAddSubtask,
  soundEnabled
}) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const isOverdue = task.dueDate && !task.completed && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0));

  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(st => st.completed).length;

  const handleCheckboxClick = (e) => {
    if (!task.completed) {
      playPopSound(soundEnabled);
      triggerParticleBurst(e.clientX, e.clientY);
    }
    onToggleComplete(task.id);
  };

  const handleSubtaskCheck = (subtaskId) => {
    playPopSound(soundEnabled);
    if (onToggleSubtask) {
      onToggleSubtask(task.id, subtaskId);
    }
  };

  const handleAddSubtaskSubmit = (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || !onAddSubtask) return;
    onAddSubtask(task.id, newSubtaskTitle.trim());
    setNewSubtaskTitle('');
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    if (dateString === today) return 'Today';
    if (dateString === tomorrow) return 'Tomorrow';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`task-item-card ${task.completed ? 'completed' : ''} ${task.pinned ? 'pinned-card' : ''} ${isOverdue ? 'overdue' : ''}`}>
      <div className="task-item-row">
        <label className="checkbox-wrapper" title={task.completed ? "Mark incomplete" : "Mark complete"}>
          <input
            type="checkbox"
            checked={task.completed}
            onChange={handleCheckboxClick}
          />
          <span className="checkbox-circle">
            {task.completed && <Check size={12} strokeWidth={3} />}
          </span>
        </label>

        <div className="task-main-info">
          <div className="task-title-row">
            <span className={`task-title ${task.completed ? 'strike' : ''}`}>
              {task.title}
            </span>

            {task.pinned && (
              <span className="pinned-badge" title="Pinned to top">
                <Pin size={11} className="pin-icon" /> Pinned
              </span>
            )}
          </div>

          {task.description && (
            <p className="task-desc">{task.description}</p>
          )}

          {/* Subtasks Progress Indicator */}
          {subtasks.length > 0 && (
            <div className="subtasks-summary-bar" onClick={() => setShowSubtasks(!showSubtasks)}>
              <div className="subtask-progress-track">
                <div 
                  className="subtask-progress-fill" 
                  style={{ width: `${Math.round((completedSubtasks / subtasks.length) * 100)}%` }} 
                />
              </div>
              <span className="subtasks-count-text">
                {completedSubtasks}/{subtasks.length} subtasks
              </span>
              {showSubtasks ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </div>
          )}

          <div className="task-badges-row">
            <span className={`priority-pill priority-${task.priority}`}>
              <span className="dot" />
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>

            {task.category && (
              <span className="category-pill">
                <Tag size={11} />
                {task.category}
              </span>
            )}

            {task.estimatedTime && (
              <span className="time-pill">
                <Clock size={11} />
                {task.estimatedTime}
              </span>
            )}

            {task.dueDate && (
              <span className={`date-pill ${isOverdue ? 'overdue-pill' : ''}`}>
                {isOverdue ? <AlertCircle size={11} /> : <Calendar size={11} />}
                {formatDate(task.dueDate)}
              </span>
            )}
          </div>

          {/* Interactive Subtasks Collapsible Panel */}
          {showSubtasks && (
            <div className="subtasks-panel">
              <div className="subtasks-list">
                {subtasks.map((st) => (
                  <label key={st.id} className="subtask-item-label">
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={() => handleSubtaskCheck(st.id)}
                    />
                    <span className={`subtask-title ${st.completed ? 'strike' : ''}`}>
                      {st.title}
                    </span>
                  </label>
                ))}
              </div>

              <form onSubmit={handleAddSubtaskSubmit} className="add-subtask-form">
                <input
                  type="text"
                  placeholder="Add a subtask..."
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  className="subtask-input"
                />
                <button type="submit" className="add-subtask-btn">
                  <Plus size={12} />
                </button>
              </form>
            </div>
          )}
        </div>

        <div className="task-hover-actions">
          <button
            className={`action-btn pin-action ${task.pinned ? 'active-pin' : ''}`}
            onClick={() => onTogglePin(task.id)}
            title={task.pinned ? "Unpin task" : "Pin to top"}
          >
            <Pin size={14} />
          </button>

          <button
            className="action-btn toggle-subtasks-btn"
            onClick={() => setShowSubtasks(!showSubtasks)}
            title="Toggle checklist"
          >
            <Plus size={14} />
          </button>

          <button
            className="action-btn edit-action"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            <Edit2 size={14} />
          </button>

          <button
            className="action-btn delete-action"
            onClick={() => setShowConfirmDelete(true)}
            title="Delete task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {showConfirmDelete && (
        <div className="delete-confirm-bar">
          <span>Delete this task?</span>
          <div className="confirm-buttons">
            <button 
              className="delete-yes-btn"
              onClick={() => {
                setShowConfirmDelete(false);
                onDelete(task.id);
              }}
            >
              Delete
            </button>
            <button 
              className="delete-no-btn"
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
