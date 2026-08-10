import React, { useState, useEffect, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Navbar } from './components/Navbar';
import { TaskStats } from './components/TaskStats';
import { TaskFilter } from './components/TaskFilter';
import { TaskList } from './components/TaskList';
import { TaskModal } from './components/TaskModal';
import { Toast } from './components/Toast';
import './App.css';

const DEFAULT_TASKS = [
  {
    id: 'sample-1',
    title: 'Explore TaskFlow Features ⚡',
    description: 'Try adding new tasks, setting priorities, adding custom tags, filtering, and switching between light and dark themes!',
    priority: 'high',
    category: 'Work',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'sample-2',
    title: 'Grocery & Home Essentials',
    description: 'Fresh vegetables, almond milk, coffee beans, and whole wheat bread.',
    priority: 'medium',
    category: 'Shopping',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    completed: false,
    createdAt: new Date(Date.now() - 7200000).toISOString()
  },
  {
    id: 'sample-3',
    title: 'Weekly Workout & Cardio Session',
    description: '30 mins resistance training followed by 15 mins stretching.',
    priority: 'low',
    category: 'Health',
    dueDate: new Date().toISOString().split('T')[0],
    completed: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const DEFAULT_CATEGORIES = ['Work', 'Personal', 'Shopping', 'Health', 'Urgent', 'Ideas'];

export function App() {
  const [tasks, setTasks] = useLocalStorage('taskflow_tasks', DEFAULT_TASKS);
  const [categories, setCategories] = useLocalStorage('taskflow_categories', DEFAULT_CATEGORIES);
  const [theme, setTheme] = useLocalStorage('taskflow_theme', 'dark');

  // Modal and Toast State
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
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
      // Edit existing task
      setTasks(prev => prev.map(t => t.id === taskData.id ? { ...t, ...taskData } : t));
      showToast('Task updated successfully!', 'success');
    } else {
      // Add new task
      const newTask = {
        ...taskData,
        id: `task-${Date.now()}`
      };
      setTasks(prev => [newTask, ...prev]);
      showToast('New task created!', 'success');
    }
  };

  // Toggle Completion State
  const handleToggleComplete = (id) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        const updatedStatus = !t.completed;
        showToast(updatedStatus ? 'Task marked as completed! 🎉' : 'Task marked as pending.', 'info');
        return { ...t, completed: updatedStatus };
      }
      return t;
    }));
  };

  // Delete Task
  const handleDeleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    showToast('Task deleted.', 'warning');
  };

  // Batch Action: Mark All Filtered Completed
  const handleMarkAllComplete = () => {
    const targetIds = new Set(filteredTasks.map(t => t.id));
    setTasks(prev => prev.map(t => targetIds.has(t.id) ? { ...t, completed: true } : t));
    showToast('All displayed tasks marked as completed!', 'success');
  };

  // Batch Action: Clear Completed Tasks
  const handleClearCompleted = () => {
    const targetIds = new Set(filteredTasks.filter(t => t.completed).map(t => t.id));
    setTasks(prev => prev.filter(t => !targetIds.has(t.id)));
    showToast('Completed tasks cleared!', 'info');
  };

  // Filtered & Sorted Tasks memoized pipeline
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        // Status filter
        if (statusFilter === 'active' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;

        // Category filter
        if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;

        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        // Search Query filter
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

  return (
    <div className="app-container">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        onOpenAddModal={handleOpenAddModal}
        totalTasks={tasks.length}
        pendingTasks={tasks.filter(t => !t.completed).length}
      />

      <main className="main-content">
        <TaskStats tasks={tasks} />

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
          onToggleComplete={handleToggleComplete}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteTask}
          onMarkAllComplete={handleMarkAllComplete}
          onClearCompleted={handleClearCompleted}
          onOpenAddModal={handleOpenAddModal}
        />
      </main>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
        categories={categories}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
