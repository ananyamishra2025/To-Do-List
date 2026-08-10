import React from 'react';
import { CheckCircle2, Clock, AlertCircle, BarChart2 } from 'lucide-react';

export function TaskStats({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter(t => !t.completed && t.priority === 'high').length;
  
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <section className="stats-section">
      <div className="stats-card main-progress-card">
        <div className="stats-header">
          <div className="stats-title">
            <BarChart2 size={18} />
            <span>Progress Overview</span>
          </div>
          <span className="percentage-text">{percentage}% Done</span>
        </div>
        <div className="progress-bar-track">
          <div 
            className="progress-bar-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="stats-hint">
          {total === 0 
            ? 'No tasks yet. Create one to get started!' 
            : completed === total 
              ? '🎉 All tasks completed! Great job!' 
              : `${pending} task${pending === 1 ? '' : 's'} remaining`}
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-box total-box">
          <div className="stat-icon total-icon">
            <Clock size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>

        <div className="stat-box completed-box">
          <div className="stat-icon completed-icon">
            <CheckCircle2 size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        <div className="stat-box pending-box">
          <div className="stat-icon pending-icon">
            <Clock size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>

        <div className="stat-box urgent-box">
          <div className="stat-icon urgent-icon">
            <AlertCircle size={18} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{highPriority}</span>
            <span className="stat-label">High Priority</span>
          </div>
        </div>
      </div>
    </section>
  );
}
