import React from 'react';
import { CheckSquare, Moon, Sun, Plus, Volume2, VolumeX, Target, Keyboard } from 'lucide-react';

export function Navbar({ 
  theme, 
  toggleTheme, 
  soundEnabled, 
  toggleSound, 
  onOpenFocusMode,
  onOpenShortcuts,
  onOpenAddModal 
}) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <div className="brand-logo">
          <div className="logo-icon">
            <CheckSquare size={20} />
          </div>
          <div className="brand-text">
            <span className="greeting-text">{getGreeting()}</span>
            <h1 className="app-title">My Tasks</h1>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <span className="date-display">{currentDate}</span>

        <button 
          className="nav-icon-btn"
          onClick={onOpenFocusMode}
          title="Distraction-Free Focus Mode (Press P)"
          aria-label="Focus Mode"
        >
          <Target size={17} />
        </button>

        <button 
          className="nav-icon-btn"
          onClick={toggleSound}
          title={soundEnabled ? "Mute tactile sounds (Press S)" : "Enable tactile sounds (Press S)"}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>

        <button 
          className="nav-icon-btn"
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts (Press ?)"
          aria-label="Keyboard Shortcuts"
        >
          <Keyboard size={17} />
        </button>

        <button 
          className="nav-icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode (Press D)`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        <button className="add-task-btn" onClick={onOpenAddModal}>
          <Plus size={15} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
