import { chartData } from '../../data/maintenanceRecords';

const padTop = 10;
const padRight = 10;
const padBottom = 24;
const padLeft = 30;
const width = 420;
const height = 120;
const innerWidth = width - padLeft - padRight;
const innerHeight = height - padTop - padBottom;

const min = 980;
const max = 2480;

function getPoint(index: number, value: number) {
  const x = padLeft + (index / (chartData.length - 1)) * innerWidth;
  const y =
    padTop + innerHeight - ((value - min) / (max - min)) * innerHeight;
  return { x, y };
}

const points = chartData.map((item, index) => getPoint(index, item.value));
const linePath = points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`).join(' ');
const areaPath = `${linePath} L ${points[points.length - 1].x} ${padTop + innerHeight} L ${points[0].x} ${padTop + innerHeight} Z`;

const guideYs = [0, 0.5, 1].map(
  (ratio) => padTop + innerHeight - ratio * innerHeight,
);

export function MonthlyCostChart() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-5 text-sm font-bold text-slate-800">
        Monthly Repair Cost Trend
      </h3>

      <svg viewBox={`0 0 ${width} ${height}`} className="h-[120px] w-full">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
          </linearGradient>
        </defs>

        {guideYs.map((y) => (
          <line
            key={y}
            x1={padLeft}
            y1={y}
            x2={width - padRight}
            y2={y}
            stroke="#E2E8F0"
            strokeWidth="1"
          />
        ))}

        <path d={areaPath} fill="url(#lineGrad)" />
        <path
          d={linePath}
          fill="none"
          stroke="#4F46E5"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <g key={chartData[index].month}>
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="white"
              stroke="#4F46E5"
              strokeWidth="2"
            />
            <text
              x={point.x}
              y={height - 6}
              fontSize="9"
              fill="#94A3B8"
              textAnchor="middle"
            >
              {chartData[index].month}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
