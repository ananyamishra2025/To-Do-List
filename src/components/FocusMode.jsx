import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, CheckCircle2, ArrowRight, Tag, AlertCircle, Clock } from 'lucide-react';
import { playPopSound, triggerParticleBurst } from '../utils/audioAndCanvas';

export function FocusMode({ activeTask, onCompleteTask, onNextTask, onClose, soundEnabled }) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const hours = Math.floor(mins / 60);
    const displayMins = mins % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(displayMins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(displayMins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleToggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const handleCompleteCurrent = (e) => {
    playPopSound(soundEnabled);
    if (e && e.clientX) {
      triggerParticleBurst(e.clientX, e.clientY);
    } else {
      triggerParticleBurst();
    }
    if (activeTask) {
      onCompleteTask(activeTask.id);
    }
  };

  if (!activeTask) {
    return (
      <div className="focus-mode-backdrop">
        <div className="focus-mode-card empty-focus">
          <button className="focus-close-btn" onClick={onClose} aria-label="Close Focus Mode">
            <X size={20} />
          </button>
          <div className="empty-focus-content">
            <CheckCircle2 size={48} className="empty-focus-icon" />
            <h2>No Active Tasks Left</h2>
            <p>You have completed all your tasks! Enjoy your free time.</p>
            <button className="btn-save" onClick={onClose}>Return to List</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="focus-mode-backdrop">
      <div className="focus-mode-card">
        <div className="focus-header">
          <div className="focus-tag">
            <span className="focus-dot" />
            <span>FOCUS MODE</span>
          </div>
          <button className="focus-close-btn" onClick={onClose} aria-label="Exit Focus Mode">
            <X size={20} />
          </button>
        </div>

        <div className="focus-body">
          <div className="focus-task-badges">
            <span className={`priority-pill priority-${activeTask.priority}`}>
              {activeTask.priority.toUpperCase()}
            </span>
            {activeTask.category && (
              <span className="category-pill">
                <Tag size={11} />
                {activeTask.category}
              </span>
            )}
          </div>

          <h1 className="focus-task-title">{activeTask.title}</h1>

          {activeTask.description && (
            <p className="focus-task-desc">{activeTask.description}</p>
          )}

          {/* Subtasks inside Focus Mode */}
          {activeTask.subtasks && activeTask.subtasks.length > 0 && (
            <div className="focus-subtasks">
              <h3>Subtasks Checklist</h3>
              <div className="focus-subtask-list">
                {activeTask.subtasks.map((st, idx) => (
                  <div key={idx} className="focus-subtask-item">
                    <span className={`subtask-bullet ${st.completed ? 'done' : ''}`}>
                      {st.completed ? '✓' : '•'}
                    </span>
                    <span className={st.completed ? 'strike' : ''}>{st.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Integrated Focus Timer */}
          <div className="focus-timer-section">
            <div className="timer-display">{formatTime(seconds)}</div>

            <div className="timer-controls">
              <button 
                className={`timer-btn toggle-timer ${isActive ? 'running' : ''}`}
                onClick={handleToggleTimer}
              >
                {isActive ? <Pause size={18} /> : <Play size={18} />}
                <span>{isActive ? 'Pause' : 'Start Focus'}</span>
              </button>

              <button className="timer-btn reset-timer" onClick={handleResetTimer} title="Reset Timer">
                <RotateCcw size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="focus-footer">
          <button className="btn-skip-task" onClick={onNextTask}>
            <span>Skip for now</span>
            <ArrowRight size={16} />
          </button>

          <button className="btn-complete-focus" onClick={handleCompleteCurrent}>
            <CheckCircle2 size={18} />
            <span>Mark Complete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
