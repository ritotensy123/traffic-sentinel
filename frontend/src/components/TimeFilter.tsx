import { useState } from 'react';

interface TimeFilterProps {
  onApply: (startTime: string, endTime: string) => void;
}

type QuickFilter = '5min' | '15min' | '1hour' | '24hours' | 'custom';

export function TimeFilter({ onApply }: TimeFilterProps) {
  const [selected, setSelected] = useState<QuickFilter>('24hours');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  const handleQuickSelect = (filter: QuickFilter) => {
    setSelected(filter);
    
    if (filter === 'custom') return;

    const now = new Date();
    const minutesAgo: Record<Exclude<QuickFilter, 'custom'>, number> = {
      '5min': 5,
      '15min': 15,
      '1hour': 60,
      '24hours': 1440,
    };

    const start = new Date(now.getTime() - minutesAgo[filter] * 60 * 1000);
    onApply(start.toISOString(), now.toISOString());
  };

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      onApply(new Date(customStart).toISOString(), new Date(customEnd).toISOString());
    }
  };

  return (
    <div className="time-filter">
      <div className="filter-buttons">
        <button
          className={selected === '5min' ? 'active' : ''}
          onClick={() => handleQuickSelect('5min')}
        >
          Last 5 minutes
        </button>
        <button
          className={selected === '15min' ? 'active' : ''}
          onClick={() => handleQuickSelect('15min')}
        >
          Last 15 minutes
        </button>
        <button
          className={selected === '1hour' ? 'active' : ''}
          onClick={() => handleQuickSelect('1hour')}
        >
          Last 1 hour
        </button>
        <button
          className={selected === '24hours' ? 'active' : ''}
          onClick={() => handleQuickSelect('24hours')}
        >
          Last 24 hours
        </button>
        <button
          className={selected === 'custom' ? 'active' : ''}
          onClick={() => setSelected('custom')}
        >
          Custom
        </button>
      </div>

      {selected === 'custom' && (
        <div className="custom-range">
          <input
            type="datetime-local"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
          />
          <span>to</span>
          <input
            type="datetime-local"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
          />
          <button onClick={handleCustomApply}>Apply</button>
        </div>
      )}
    </div>
  );
}

