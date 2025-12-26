import { useState } from 'react';
import { LogFilters as LogFiltersType } from '../types/index.js';

interface LogFiltersProps {
  services: string[];
  onApply: (filters: LogFiltersType) => void;
  onClear: () => void;
}

const timeRangeOptions = [
  { label: 'All Time', value: '' },
  { label: 'Last 5 minutes', value: '5' },
  { label: 'Last 30 minutes', value: '30' },
  { label: 'Last 1 hour', value: '60' },
  { label: 'Last 24 hours', value: '1440' }
];

const getStartTimeFromMinutes = (minutes: string): string => {
  if (!minutes) return '';
  const now = new Date();
  const ms = parseInt(minutes, 10) * 60 * 1000;
  return new Date(now.getTime() - ms).toISOString();
};

export function LogFilters({ services, onApply, onClear }: LogFiltersProps) {
  const [search, setSearch] = useState('');
  const [serviceName, setServiceName] = useState('');
  const [statusCode, setStatusCode] = useState('');
  const [timeRange, setTimeRange] = useState('');

  const handleApply = () => {
    onApply({
      search: search.trim(),
      serviceName,
      statusCode,
      startTime: getStartTimeFromMinutes(timeRange)
    });
  };

  const handleClear = () => {
    setSearch('');
    setServiceName('');
    setStatusCode('');
    setTimeRange('');
    onClear();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApply();
    }
  };

  return (
    <div className="log-filters">
      <div className="filters-row">
        <input
          type="text"
          placeholder="Search service or IP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
          className="filter-input filter-search"
        />
        <select
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className="filter-select"
        >
          <option value="">All Services</option>
          {services.map((service) => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>
        <select
          value={statusCode}
          onChange={(e) => setStatusCode(e.target.value)}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="2xx">2xx Success</option>
          <option value="3xx">3xx Redirect</option>
          <option value="4xx">4xx Client Error</option>
          <option value="5xx">5xx Server Error</option>
        </select>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="filter-select"
        >
          {timeRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <button onClick={handleApply} className="filter-button apply">Apply</button>
        <button onClick={handleClear} className="filter-button clear">Clear</button>
      </div>
    </div>
  );
}
