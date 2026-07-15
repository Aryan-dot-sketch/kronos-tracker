import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { Button } from '../ui/Button';
import { Search } from 'lucide-react';

const PRIORITIES = ['critical', 'high', 'medium', 'low'];

export const TaskFilters: React.FC = () => {
  const { state, searchQuery, setSearchQuery } = useKronos();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    state.ui.taskStatusFilter = e.target.value;
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    state.ui.taskPriorityFilter = e.target.value;
  };

  const handleClear = () => {
    setSearchQuery('');
    state.ui.taskStatusFilter = 'all';
    state.ui.taskPriorityFilter = 'all';
  };

  return (
    <div className="filter-row">
      <div className="search-input-wrap">
        <Search className="search-icon" size={16} />
        <input
          placeholder="Search tasks, subjects, focus notes..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      <label>
        Status
        <select
          defaultValue={state.ui.taskStatusFilter || 'all'}
          onChange={handleStatusChange}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="missed">Missed</option>
          <option value="skipped">Skipped</option>
        </select>
      </label>

      <label>
        Priority
        <select
          defaultValue={state.ui.taskPriorityFilter || 'all'}
          onChange={handlePriorityChange}
        >
          <option value="all">All Priorities</option>
          {PRIORITIES.map(p => (
            <option key={p} value={p}>{p.toUpperCase()}</option>
          ))}
        </select>
      </label>

      <Button variant="ghost" type="button" onClick={handleClear}>Clear</Button>
    </div>
  );
};
