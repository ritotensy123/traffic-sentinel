import { memo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StatusDistribution } from '../types';

interface StatusChartProps {
  data: StatusDistribution[];
}

function getStatusColor(statusCode: string): string {
  switch (statusCode) {
    case '2xx': 
      return '#22c55e';
    case '3xx': 
      return '#3b82f6';
    case '4xx': 
      return '#f97316';
    case '5xx': 
      return '#ef4444';
    default: 
      return '#6b7280';
  }
}

export const StatusChart = memo(function StatusChart({ data }: StatusChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-container">
        <h3>Status Code Distribution</h3>
        <div className="chart-empty">No status data available</div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    status: item.status_code,
    count: item.count,
  }));

  return (
    <div className="chart-container">
      <h3>Status Code Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" isAnimationActive={false}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getStatusColor(entry.status)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
});
