import React from 'react';
import { CheckSquare, Moon, Sun, Plus, Sparkles } from 'lucide-react';

export function Navbar({ theme, toggleTheme, onOpenAddModal, totalTasks, pendingTasks }) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <div className="brand-logo">
          <div className="logo-icon">
            <CheckSquare size={24} className="icon-glow" />
          </div>
          <div className="brand-text">
            <h1>Task<span className="gradient-text">Flow</span></h1>
            <span className="brand-subtitle">Smart Task Management</span>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <div className="date-badge">
          <Sparkles size={14} className="sparkle-icon" />
          <span>{currentDate}</span>
        </div>

        <button 
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun size={20} className="sun-icon" />
          ) : (
            <Moon size={20} className="moon-icon" />
          )}
        </button>

        <button className="add-task-btn" onClick={onOpenAddModal}>
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
