import { memo, useState, useEffect } from 'react';
import { RecentLog, LogFilters as LogFiltersType } from '../types';
import { formatTimestamp, formatRelativeTimeShort, formatLatency, getStatusCodeColor } from '../utils/formatters';
import { LogFilters } from './LogFilters';
import { Pagination } from './Pagination';

interface RecentLogsProps {
  logs: RecentLog[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  onApply: (filters: LogFiltersType) => void;
  onClear: () => void;
  onPageChange: (page: number) => void;
  availableServices: string[];
}

export const RecentLogs = memo(function RecentLogs({
  logs,
  total,
  page,
  totalPages,
  isLoading,
  onApply,
  onClear,
  onPageChange,
  availableServices,
}: RecentLogsProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="recent-logs">
      <h3>Recent Logs</h3>
      
      <LogFilters
        services={availableServices}
        onApply={onApply}
        onClear={onClear}
      />

      {isLoading && logs.length === 0 ? (
        <div className="table-loading">Loading logs...</div>
      ) : logs.length === 0 ? (
        <div className="no-data">No logs found</div>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Time Ago</th>
                  <th>Service</th>
                  <th>Status</th>
                  <th>Latency</th>
                  <th>Origin IP</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="time-cell">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="age-column">
                      {formatRelativeTimeShort(log.timestamp)}
                    </td>
                    <td>{log.service_name}</td>
                    <td>
                      <span className={`status-badge ${getStatusCodeColor(log.status_code)}`}>
                        {log.status_code}
                      </span>
                    </td>
                    <td className="mono">{formatLatency(log.latency_ms)}</td>
                    <td className="mono">{log.origin_ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            total={total}
            limit={10}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
});

