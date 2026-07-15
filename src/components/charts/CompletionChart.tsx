import React from 'react';
import { useKronos } from '@/context/KronosContext';
import { todayId, addDays, dateLabel } from '@/lib/time/ist';

interface CompletionChartProps {
  days: number;
}

export const CompletionChart: React.FC<CompletionChartProps> = ({ days }) => {
  const { state, openModal } = useKronos();

  const values = Array.from({ length: days }, (_, index) => {
    const dateId = addDays(todayId(), index - days + 1);
    return { dateId, value: state.history[dateId]?.completionScore || 0 };
  });

  const width = 520;
  const height = 200;
  const pad = 24;
  const step = (width - pad * 2) / Math.max(1, days - 1);

  const points = values.map((item, index) => [
    pad + index * step,
    height - pad - (item.value / 100) * (height - pad * 2)
  ]);

  const line = points.map(point => point.join(',')).join(' ');
  const area = `${pad},${height - pad} ${line} ${width - pad},${height - pad}`;

  return (
    <div className="chart-wrap">
      <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <line className="chart-grid-line" x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} />
        <line className="chart-grid-line" x1={pad} y1={pad} x2={width - pad} y2={pad} />
        <polygon className="chart-area" points={area} />
        <polyline className="chart-line" points={line} />
        {points.map((point, index) => (
          <circle
            key={values[index].dateId}
            className="chart-dot"
            cx={point[0]}
            cy={point[1]}
            r={5}
            onClick={() => openModal('dayDetail', values[index].dateId)}
          >
            <title>{`${dateLabel(values[index].dateId)} • ${values[index].value}%`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
};
