import React, { useRef } from 'react';
import { CheckSquare, Moon, Sun, Plus, Volume2, VolumeX, Target, Keyboard, Download, Upload } from 'lucide-react';
import { exportTasksToJSON, importTasksFromJSON } from '../utils/taskExportImport';

export function Navbar({ 
  tasks,
  onImportTasks,
  theme, 
  toggleTheme, 
  soundEnabled, 
  toggleSound, 
  onOpenFocusMode,
  onOpenShortcuts,
  onOpenAddModal 
}) {
  const fileInputRef = useRef(null);

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

  const handleExport = () => {
    exportTasksToJSON(tasks);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      importTasksFromJSON(file, onImportTasks);
    }
  };

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <div className="brand-logo">
          <div className="logo-icon">
            <CheckSquare size={20} />
          </div>
          <div className="brand-text">
            <span className="greeting-text">{getGreeting()}</span>
            <h1 className="app-title">Focus</h1>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <span className="date-display">{currentDate}</span>

        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept=".json" 
          onChange={handleFileChange} 
        />

        <button 
          className="nav-icon-btn"
          onClick={handleExport}
          title="Backup / Export Tasks (JSON)"
          aria-label="Export Tasks"
        >
          <Download size={16} />
        </button>

        <button 
          className="nav-icon-btn"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          title="Restore / Import Tasks (JSON)"
          aria-label="Import Tasks"
        >
          <Upload size={16} />
        </button>

        <button 
          className="nav-icon-btn"
          onClick={onOpenFocusMode}
          title="Focus Mode Spotlight (P)"
          aria-label="Focus Mode"
        >
          <Target size={16} />
        </button>

        <button 
          className="nav-icon-btn"
          onClick={toggleSound}
          title={soundEnabled ? "Mute sound (S)" : "Enable sound (S)"}
          aria-label="Toggle Sound"
        >
          {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        <button 
          className="nav-icon-btn"
          onClick={onOpenShortcuts}
          title="Shortcuts guide (?)"
          aria-label="Keyboard Shortcuts"
        >
          <Keyboard size={16} />
        </button>

        <button 
          className="nav-icon-btn"
          onClick={toggleTheme}
          title={`Switch theme (D)`}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        <button className="add-task-btn" onClick={onOpenAddModal}>
          <Plus size={15} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
