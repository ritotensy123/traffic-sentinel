import { memo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimeSeriesPoint } from '../types';

interface RequestsChartProps {
  data: TimeSeriesPoint[];
}

export const RequestsChart = memo(function RequestsChart({ data }: RequestsChartProps) {
  const chartData = data.map((point) => ({
    time: new Date(point.bucket).toLocaleTimeString(),
    count: point.count,
  }));

  return (
    <div className="chart-container">
      <h3>Requests Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#333" strokeWidth={2} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
});

