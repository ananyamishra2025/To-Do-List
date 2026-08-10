import React from 'react';
import { TaskItem } from './TaskItem';
import { ClipboardList, CheckCheck, Trash, Plus } from 'lucide-react';

export function TaskList({ 
  tasks, 
  allTasksCount,
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onMarkAllComplete, 
  onClearCompleted,
  onOpenAddModal
}) {
  const completedCount = tasks.filter(t => t.completed).length;

  if (tasks.length === 0) {
    return (
      <div className="empty-state-card">
        <div className="empty-icon-wrapper">
          <ClipboardList size={48} className="empty-icon" />
        </div>
        {allTasksCount === 0 ? (
          <>
            <h3>No Tasks Yet</h3>
            <p>Organize your day, boost productivity, and stay on top of goals.</p>
            <button className="empty-add-btn" onClick={onOpenAddModal}>
              <Plus size={18} />
              <span>Create Your First Task</span>
            </button>
          </>
        ) : (
          <>
            <h3>No Matching Tasks</h3>
            <p>Try adjusting your search query, status tabs, category, or priority filters.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="task-list-section">
      <div className="task-list-header">
        <span className="task-count-indicator">
          Showing <strong>{tasks.length}</strong> task{tasks.length === 1 ? '' : 's'}
        </span>

        <div className="batch-actions">
          {completedCount < tasks.length && (
            <button 
              className="batch-btn complete-all-btn" 
              onClick={onMarkAllComplete}
              title="Mark all displayed tasks as completed"
            >
              <CheckCheck size={14} />
              <span>Mark All Completed</span>
            </button>
          )}

          {completedCount > 0 && (
            <button 
              className="batch-btn clear-completed-btn" 
              onClick={onClearCompleted}
              title="Clear all completed tasks"
            >
              <Trash size={14} />
              <span>Clear Completed ({completedCount})</span>
            </button>
          )}
        </div>
      </div>

      <div className="task-items-grid">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
