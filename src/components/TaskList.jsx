import React from 'react';
import { TaskItem } from './TaskItem';
import { QuickAdd } from './QuickAdd';
import { CheckCheck, Trash, Sparkles, Pin } from 'lucide-react';

export function TaskList({ 
  tasks, 
  allTasksCount,
  onAddTask,
  onToggleComplete, 
  onEdit, 
  onDelete, 
  onTogglePin,
  onToggleSubtask,
  onAddSubtask,
  onMarkAllComplete, 
  onClearCompleted,
  onOpenAddModal,
  categories,
  soundEnabled
}) {
  const completedCount = tasks.filter(t => t.completed).length;

  const pinnedTasks = tasks.filter(t => t.pinned);
  const unpinnedTasks = tasks.filter(t => !t.pinned);

  return (
    <div className="task-list-container">
      {/* Inline Quick Add Component */}
      <QuickAdd onAddTask={onAddTask} categories={categories} />

      {tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-bubble">
            <Sparkles size={28} />
          </div>
          {allTasksCount === 0 ? (
            <>
              <h3>Your list is clear</h3>
              <p>Add your first task above to start organizing your day.</p>
            </>
          ) : (
            <>
              <h3>No tasks found</h3>
              <p>Try clearing filters or searching for something else.</p>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="list-toolbar-header">
            <span className="list-count-label">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </span>

            <div className="batch-actions-group">
              {completedCount < tasks.length && (
                <button 
                  className="subtle-batch-btn" 
                  onClick={onMarkAllComplete}
                  title="Mark all displayed tasks completed"
                >
                  <CheckCheck size={13} />
                  <span>Mark all done</span>
                </button>
              )}

              {completedCount > 0 && (
                <button 
                  className="subtle-batch-btn clear-done" 
                  onClick={onClearCompleted}
                  title="Clear completed tasks"
                >
                  <Trash size={13} />
                  <span>Clear done ({completedCount})</span>
                </button>
              )}
            </div>
          </div>

          {/* Pinned Tasks Group */}
          {pinnedTasks.length > 0 && (
            <div className="task-group pinned-group">
              <div className="group-title">
                <Pin size={12} className="pin-title-icon" />
                <span>PINNED ({pinnedTasks.length})</span>
              </div>
              <div className="task-items-stack">
                {pinnedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onTogglePin={onTogglePin}
                    onToggleSubtask={onToggleSubtask}
                    onAddSubtask={onAddSubtask}
                    soundEnabled={soundEnabled}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Tasks Group */}
          {unpinnedTasks.length > 0 && (
            <div className="task-group">
              {pinnedTasks.length > 0 && (
                <div className="group-title">
                  <span>OTHERS ({unpinnedTasks.length})</span>
                </div>
              )}
              <div className="task-items-stack">
                {unpinnedTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggleComplete={onToggleComplete}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onTogglePin={onTogglePin}
                    onToggleSubtask={onToggleSubtask}
                    onAddSubtask={onAddSubtask}
                    soundEnabled={soundEnabled}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
