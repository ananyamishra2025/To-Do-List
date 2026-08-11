import React from 'react';
import { Search, X, Tag, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export function TaskFilter({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  priorityFilter,
  setPriorityFilter,
  sortBy,
  setSortBy,
  categories
}) {
  return (
    <section className="filter-toolbar">
      <div className="search-bar-wrapper">
        <Search size={16} className="search-icon" />
        <input
          type="text"
          placeholder="Filter or search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button 
            className="search-clear-btn" 
            onClick={() => setSearchQuery('')}
            title="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="filter-controls-row">
        <div className="status-tabs">
          <button
            className={`tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button
            className={`tab-btn ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            Active
          </button>
          <button
            className={`tab-btn ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed
          </button>
        </div>

        <div className="select-dropdowns">
          <div className="select-wrapper">
            <Tag size={13} className="select-icon" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="custom-select"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="select-wrapper">
            <SlidersHorizontal size={13} className="select-icon" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="custom-select"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div className="select-wrapper">
            <ArrowUpDown size={13} className="select-icon" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="custom-select"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="dueDate-asc">Due Date</option>
              <option value="priority-high">Priority (High first)</option>
              <option value="title-asc">Title (A to Z)</option>
            </select>
          </div>
        </div>
      </div>
    </section>
  );
}
