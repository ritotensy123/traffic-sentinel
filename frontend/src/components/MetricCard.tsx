import { memo } from 'react';
import { formatNumber } from '../utils/formatters';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

export const MetricCard = memo(function MetricCard({ label, value, unit }: MetricCardProps) {
  const formattedValue = typeof value === 'number' ? formatNumber(value) : value;
  
  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">
        {formattedValue}
        {unit && <span className="metric-unit">{unit}</span>}
      </div>
    </div>
  );
});

