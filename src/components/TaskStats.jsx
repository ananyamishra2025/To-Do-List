import React from 'react';
import { ProgressRing } from './ProgressRing';
import { CheckCircle2, Clock, AlertCircle, Flame, CalendarDays } from 'lucide-react';

export function TaskStats({ tasks, streakCount = 1 }) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter(t => !t.completed && t.priority === 'high').length;
  const todayTasks = tasks.filter(t => {
    const today = new Date().toISOString().split('T')[0];
    return t.dueDate === today;
  }).length;

  const percentage = total > 0 ? (completed / total) * 100 : 0;

  const getMotivationalNote = () => {
    const hour = new Date().getHours();
    if (total === 0) return 'Your canvas is clear. Add a task to start your day.';
    if (completed === total) return '🎉 All done! Outstanding productivity today.';
    if (hour < 12) return `Good morning focus! ${pending} item${pending === 1 ? '' : 's'} to conquer.`;
    if (hour < 18) return `Afternoon momentum! ${completed} finished, ${pending} left.`;
    return `Evening reflection. Wrap up remaining ${pending} task${pending === 1 ? '' : 's'}.`;
  };

  return (
    <section className="stats-section">
      <div className="stats-card">
        <div className="stats-top">
          <div className="stats-headline-group">
            <ProgressRing radius={26} stroke={3.5} progress={percentage} />
            <div className="stats-headline-text">
              <span className="motivational-note">{getMotivationalNote()}</span>
              <div className="stats-sub-bar">
                <span className="stats-count-pill">
                  <strong>{completed}</strong> of <strong>{total}</strong> completed
                </span>
                {streakCount > 0 && (
                  <span className="streak-badge" title="Daily completion streak">
                    <Flame size={13} className="flame-icon" />
                    <span>{streakCount} day streak</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="stats-chips">
          <div className="stat-chip">
            <span className="chip-value">{total}</span>
            <span className="chip-label">Total</span>
          </div>
          <div className="stat-chip completed">
            <CheckCircle2 size={13} />
            <span className="chip-value">{completed}</span>
            <span className="chip-label">Done</span>
          </div>
          <div className="stat-chip pending">
            <Clock size={13} />
            <span className="chip-value">{pending}</span>
            <span className="chip-label">Pending</span>
          </div>
          {todayTasks > 0 && (
            <div className="stat-chip today-chip">
              <CalendarDays size={13} />
              <span className="chip-value">{todayTasks}</span>
              <span className="chip-label">Due Today</span>
            </div>
          )}
          {highPriority > 0 && (
            <div className="stat-chip high-priority">
              <AlertCircle size={13} />
              <span className="chip-value">{highPriority}</span>
              <span className="chip-label">High Priority</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
