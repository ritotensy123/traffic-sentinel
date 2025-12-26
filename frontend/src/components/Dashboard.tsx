import { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { useLogs } from '../hooks/useLogs';
import { MetricCard } from './MetricCard';
import { RequestsChart } from './RequestsChart';
import { StatusChart } from './StatusChart';
import { RecentLogs } from './RecentLogs';
import { formatPercentage } from '../utils/formatters';
import { fetchAvailableServices } from '../api/analytics';
import { LogFilters } from '../types/index.js';

export function Dashboard() {
  const { data, isLoading, error, lastUpdated } = useAnalytics();
  
  const { logs, total, page, totalPages, isLoading: logsLoading, setPage, setFilters } = useLogs();

  const [availableServices, setAvailableServices] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const loadServices = async () => {
      try {
        const services = await fetchAvailableServices();
        setAvailableServices(services);
      } catch (err) {
        console.error('Failed to fetch available services:', err);
      }
    };
    loadServices();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatLastUpdated = (lastUpdated: Date | null): string => {
    if (!lastUpdated) return 'Never';
    const seconds = Math.floor((currentTime.getTime() - lastUpdated.getTime()) / 1000);
    if (seconds < 1) return 'just now';
    if (seconds === 1) return '1 second ago';
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) return '1 minute ago';
    return `${minutes} minutes ago`;
  };

  const handleFiltersApply = (newFilters: LogFilters) => {
    setFilters(newFilters);
  };

  const handleFiltersClear = () => {
    setFilters({});
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading && !data) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error && !data) {
    return <div className="error">Error: {error}</div>;
  }

  if (!data) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="update-info">
          {lastUpdated && (
            <span className="last-updated">
              Last updated: {formatLastUpdated(lastUpdated)} (auto-refreshes every 5s)
            </span>
          )}
        </div>
      </div>

      <div className="metrics">
        <MetricCard
          label="Total Requests"
          value={data.summary.totalRequests}
        />
        <MetricCard
          label="Error Rate"
          value={formatPercentage(data.summary.errorRate)}
        />
        <MetricCard
          label="Average Latency"
          value={Math.round(data.summary.averageLatency)}
          unit="ms"
        />
      </div>

      <div className="charts">
        <RequestsChart data={data.timeSeries} />
        <StatusChart data={data.statusDistribution} />
      </div>

      <RecentLogs
        logs={logs}
        total={total}
        page={page}
        totalPages={totalPages}
        isLoading={logsLoading}
        onApply={handleFiltersApply}
        onClear={handleFiltersClear}
        onPageChange={handlePageChange}
        availableServices={availableServices}
      />
    </div>
  );
}

