import React, { useState, useRef } from 'react';
import { Plus, Calendar, Tag, AlertCircle, CornerDownLeft } from 'lucide-react';

export function QuickAdd({ onAddTask, categories }) {
  const [title, setTitle] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: '',
      priority,
      category,
      dueDate: dueDate || null,
      completed: false,
      createdAt: new Date().toISOString()
    });

    setTitle('');
    setIsExpanded(false);
  };

  const handleQuickDate = (type) => {
    const today = new Date();
    if (type === 'today') {
      setDueDate(today.toISOString().split('T')[0]);
    } else if (type === 'tomorrow') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
    } else if (type === 'clear') {
      setDueDate('');
    }
  };

  return (
    <div className={`quick-add-card ${isExpanded ? 'expanded' : ''}`}>
      <form onSubmit={handleSubmit} className="quick-add-form">
        <div className="quick-add-input-row">
          <div className="quick-add-icon">
            <Plus size={18} />
          </div>
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a task... (press Enter to save)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="quick-add-input"
          />
          {title.trim() && (
            <button type="submit" className="quick-add-submit-btn" title="Save task (Enter)">
              <CornerDownLeft size={16} />
              <span>Add</span>
            </button>
          )}
        </div>

        {isExpanded && (
          <div className="quick-add-toolbar">
            <div className="quick-add-options">
              {/* Quick Date Presets */}
              <div className="quick-chip-group">
                <span className="chip-group-label"><Calendar size={13} /> Date:</span>
                <button
                  type="button"
                  className={`chip-btn ${dueDate === new Date().toISOString().split('T')[0] ? 'active' : ''}`}
                  onClick={() => handleQuickDate('today')}
                >
                  Today
                </button>
                <button
                  type="button"
                  className="chip-btn"
                  onClick={() => handleQuickDate('tomorrow')}
                >
                  Tomorrow
                </button>
                {dueDate && (
                  <button
                    type="button"
                    className="chip-btn clear-chip"
                    onClick={() => handleQuickDate('clear')}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Priority Select */}
              <div className="quick-chip-group">
                <span className="chip-group-label"><AlertCircle size={13} /> Priority:</span>
                <button
                  type="button"
                  className={`chip-btn priority-chip-low ${priority === 'low' ? 'active' : ''}`}
                  onClick={() => setPriority('low')}
                >
                  Low
                </button>
                <button
                  type="button"
                  className={`chip-btn priority-chip-medium ${priority === 'medium' ? 'active' : ''}`}
                  onClick={() => setPriority('medium')}
                >
                  Medium
                </button>
                <button
                  type="button"
                  className={`chip-btn priority-chip-high ${priority === 'high' ? 'active' : ''}`}
                  onClick={() => setPriority('high')}
                >
                  High
                </button>
              </div>

              {/* Category Select */}
              <div className="quick-chip-group">
                <span className="chip-group-label"><Tag size={13} /> Category:</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="quick-category-select"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="quick-add-footer-actions">
              <button
                type="button"
                className="cancel-inline-btn"
                onClick={() => {
                  setTitle('');
                  setIsExpanded(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
