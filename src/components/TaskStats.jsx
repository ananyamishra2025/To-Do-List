import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export function TaskStats({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter(t => !t.completed && t.priority === 'high').length;
  
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="stats-section">
      <div className="stats-card">
        <div className="stats-top">
          <div className="stats-headline">
            {total === 0 ? (
              <span>No tasks added yet</span>
            ) : completed === total ? (
              <span className="all-done-msg">✨ Everything's done for now! Take a break.</span>
            ) : (
              <span>You have <strong>{pending} task{pending === 1 ? '' : 's'}</strong> left to complete</span>
            )}
          </div>
          <span className="progress-percentage">{percentage}% done</span>
        </div>

        <div className="progress-bar-track">
          <div 
            className="progress-bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="stats-chips">
          <div className="stat-chip">
            <span className="chip-value">{total}</span>
            <span className="chip-label">Total</span>
          </div>
          <div className="stat-chip completed">
            <CheckCircle2 size={14} />
            <span className="chip-value">{completed}</span>
            <span className="chip-label">Done</span>
          </div>
          <div className="stat-chip pending">
            <Clock size={14} />
            <span className="chip-value">{pending}</span>
            <span className="chip-label">Pending</span>
          </div>
          {highPriority > 0 && (
            <div className="stat-chip high-priority">
              <AlertCircle size={14} />
              <span className="chip-value">{highPriority}</span>
              <span className="chip-label">High Priority</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
