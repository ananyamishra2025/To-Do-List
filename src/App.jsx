import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Navbar } from './components/Navbar';
import { TaskStats } from './components/TaskStats';
import { TaskFilter } from './components/TaskFilter';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { FocusMode } from './components/FocusMode';
import { ShortcutsModal } from './components/ShortcutsModal';
import { Toast } from './components/Toast';
import { playPopSound, triggerParticleBurst } from './utils/audioAndCanvas';
import './App.css';

const DEFAULT_TASKS = [
  {
    id: 'sample-1',
    title: 'Review team project updates & feedback',
    description: 'Go over recent commits, review pull requests, and organize upcoming sprint goals.',
    priority: 'high',
    category: 'Work',
    pinned: true,
    estimatedTime: '30 min',
    subtasks: [
      { id: 'st-1', title: 'Review pull requests on GitHub', completed: true },
      { id: 'st-2', title: 'Write feedback notes for design team', completed: false },
      { id: 'st-3', title: 'Update project roadmap milestone', completed: false }
    ],
    dueDate: new Date().toISOString().split('T')[0],
    completed: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'sample-2',
    title: 'Buy fresh groceries and artisan coffee',
    description: 'Whole milk, fresh sourdough bread, organic eggs, and espresso beans.',
    priority: 'medium',
    category: 'Shopping',
    pinned: false,
    estimatedTime: '15 min',
    subtasks: [
      { id: 'st-4', title: 'Organic whole milk', completed: true },
      { id: 'st-5', title: 'Espresso coffee beans', completed: false }
    ],
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'sample-3',
    title: '30-minute evening walk & stretch',
    description: 'Unplug from screens and enjoy fresh air.',
    priority: 'low',
    category: 'Personal',
    pinned: false,
    estimatedTime: '30 min',
    subtasks: [],
    dueDate: new Date().toISOString().split('T')[0],
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const DEFAULT_CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Errands', 'Ideas'];

export function App() {
  const [tasks, setTasks] = useLocalStorage('focus_tasks_v3', DEFAULT_TASKS);
  const [categories, setCategories] = useLocalStorage('focus_categories_v3', DEFAULT_CATEGORIES);
  const [theme, setTheme] = useLocalStorage('focus_theme', 'dark');
  const [soundEnabled, setSoundEnabled] = useLocalStorage('focus_sound', true);
  const [streakCount] = useLocalStorage('focus_streak', 3);

  // Modals & Overlays State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [focusTaskIndex, setFocusTaskIndex] = useState(0);

  const [taskToEdit, setTaskToEdit] = useState(null);
  const [toast, setToast] = useState(null);

  // Filter and Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt-desc');

  // Apply Theme attribute to <html> element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
        if (e.key === 'Escape') {
          document.activeElement.blur();
        }
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setTaskToEdit(null);
        setIsModalOpen(true);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        const searchEl = document.querySelector('.search-input');
        if (searchEl) searchEl.focus();
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        toggleTheme();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        toggleSound();
      } else if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsFocusModeOpen(prev => !prev);
      } else if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsModalOpen(false);
        setIsShortcutsOpen(false);
        setIsFocusModeOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, soundEnabled]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      showToast(next ? 'Tactile sound enabled 🔊' : 'Sound muted 🔇', 'info');
      return next;
    });
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  // Restore tasks from JSON
  const handleImportTasks = (importedTasks) => {
    setTasks(importedTasks);
    showToast(`Restored ${importedTasks.length} tasks successfully!`, 'success');
  };

  // Open Modal for New Task
  const handleOpenAddModal = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  // Open Modal for Editing Task
  const handleOpenEditModal = (task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  // Add or Save Task
  const handleSaveTask = (taskData) => {
    if (taskData.category && !categories.includes(taskData.category)) {
      setCategories(prev => [...prev, taskData.category]);
    }

    if (taskData.id) {
      setTasks(prev => prev.map(t => t.id === taskData.id ? { ...t, ...taskData } : t));
      showToast('Task updated', 'success');
    } else {
      const newTask = {
        ...taskData,
        id: `task-${Date.now()}`
      };
      setTasks(prev => [newTask, ...prev]);
      showToast('Task added', 'success');
    }
  };

  // Quick Add from inline input
  const handleQuickAdd = (taskData) => {
    const newTask = {
      ...taskData,
      id: `task-${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);
    showToast('Task added to your list', 'success');
  };

  // Toggle Pin Status
  const handleTogglePin = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const nextPinned = !t.pinned;
        showToast(nextPinned ? 'Task pinned to top 📌' : 'Task unpinned', 'info');
        return { ...t, pinned: nextPinned };
      }
      return t;
    }));
  };

  // Toggle Completion State
  const handleToggleComplete = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updatedStatus = !t.completed;
        showToast(updatedStatus ? 'Completed! ✨' : 'Marked active', 'info');
        return { ...t, completed: updatedStatus };
      }
      return t;
    }));
  };

  // Toggle Subtask Completion
  const handleToggleSubtask = (taskId, subtaskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubtasks = (t.subtasks || []).map(st => {
          if (st.id === subtaskId) {
            return { ...st, completed: !st.completed };
          }
          return st;
        });

        const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every(st => st.completed);
        return { ...t, subtasks: updatedSubtasks, completed: allDone ? true : t.completed };
      }
      return t;
    }));
  };

  // Add Subtask to Task
  const handleAddSubtask = (taskId, subtaskTitle) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const newSubtask = {
          id: `st-${Date.now()}`,
          title: subtaskTitle,
          completed: false
        };
        return { ...t, subtasks: [...(t.subtasks || []), newSubtask] };
      }
      return t;
    }));
    showToast('Subtask added', 'success');
  };

  // Delete Task
  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Task deleted', 'warning');
  };

  // Batch Action: Mark All Filtered Completed
  const handleMarkAllComplete = () => {
    playPopSound(soundEnabled);
    triggerParticleBurst();
    const targetIds = new Set(filteredTasks.map(t => t.id));
    setTasks(prev => prev.map(t => targetIds.has(t.id) ? { ...t, completed: true } : t));
    showToast('All tasks marked done!', 'success');
  };

  // Batch Action: Clear Completed Tasks
  const handleClearCompleted = () => {
    const targetIds = new Set(filteredTasks.filter(t => t.completed).map(t => t.id));
    setTasks(prev => prev.filter(t => !targetIds.has(t.id)));
    showToast('Completed tasks cleared', 'info');
  };

  // Filtered & Sorted Tasks memoized pipeline
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        if (statusFilter === 'active' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;

        if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(query);
          const matchDesc = task.description ? task.description.toLowerCase().includes(query) : false;
          const matchCategory = task.category ? task.category.toLowerCase().includes(query) : false;
          return matchTitle || matchDesc || matchCategory;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        if (sortBy === 'createdAt-desc') return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === 'createdAt-asc') return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
        if (sortBy === 'dueDate-asc') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'priority-high') {
          const weights = { high: 3, medium: 2, low: 1 };
          return weights[b.priority] - weights[a.priority];
        }
        return 0;
      });
  }, [tasks, statusFilter, categoryFilter, priorityFilter, searchQuery, sortBy]);

  // Active tasks for Focus Mode
  const activeFocusTasks = useMemo(() => {
    return tasks.filter(t => !t.completed);
  }, [tasks]);

  const currentFocusTask = activeFocusTasks[focusTaskIndex % (activeFocusTasks.length || 1)];

  return (
    <div className="app-container">
      <Navbar
        tasks={tasks}
        onImportTasks={handleImportTasks}
        theme={theme}
        toggleTheme={toggleTheme}
        soundEnabled={soundEnabled}
        toggleSound={toggleSound}
        onOpenFocusMode={() => setIsFocusModeOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenAddModal={handleOpenAddModal}
        totalTasks={tasks.length}
        pendingTasks={tasks.filter(t => !t.completed).length}
      />

      <main className="main-content">
        <TaskStats tasks={tasks} streakCount={streakCount} />

        <TaskFilter
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          categories={categories}
        />

        <TaskList
          tasks={filteredTasks}
          allTasksCount={tasks.length}
          onAddTask={handleQuickAdd}
          onToggleComplete={handleToggleComplete}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTask}
          onTogglePin={handleTogglePin}
          onToggleSubtask={handleToggleSubtask}
          onAddSubtask={handleAddSubtask}
          onMarkAllComplete={handleMarkAllComplete}
          onClearCompleted={handleClearCompleted}
          onOpenAddModal={handleOpenAddModal}
          categories={categories}
          soundEnabled={soundEnabled}
        />
      </main>

      {/* Task Add / Edit Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        categories={categories}
      />

      {/* Keyboard Shortcuts Cheatsheet Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Focus Mode Overlay */}
      {isFocusModeOpen && (
        <FocusMode
          activeTask={currentFocusTask}
          onCompleteTask={handleToggleComplete}
          onNextTask={() => setFocusTaskIndex(idx => idx + 1)}
          onClose={() => setIsFocusModeOpen(false)}
          soundEnabled={soundEnabled}
        />
      )}

      {/* Notification Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
