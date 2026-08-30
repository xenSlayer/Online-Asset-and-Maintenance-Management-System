import type { DashboardAssetSegment } from '../../types/dashboard';

interface AssetDonutChartProps {
  segments: DashboardAssetSegment[];
}

function buildSegments(segments: DashboardAssetSegment[]) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  if (total === 0) {
    return { total: 0, donutSegments: [] };
  }

  const donutSegments = segments.map((segment) => {
    const length = (segment.value / total) * circumference;
    const item = {
      ...segment,
      dasharray: `${length} ${circumference - length}`,
      offset,
    };
    offset += length;
    return item;
  });

  return { total, donutSegments };
}

export function AssetDonutChart({ segments }: AssetDonutChartProps) {
  const { total, donutSegments } = buildSegments(segments);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h3 className="text-sm font-bold text-slate-800">Asset Status</h3>
        <p className="text-xs text-slate-400">Current breakdown</p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative h-[140px] w-[140px] shrink-0">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <g transform="rotate(-90 70 70)">
              {donutSegments.length > 0 ? (
                donutSegments.map((segment) => (
                  <circle
                    key={segment.label}
                    cx="70"
                    cy="70"
                    r={50}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="22"
                    strokeDasharray={segment.dasharray}
                    strokeDashoffset={-segment.offset}
                  />
                ))
              ) : (
                <circle
                  cx="70"
                  cy="70"
                  r={50}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="22"
                />
              )}
            </g>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-900">{total}</span>
            <span className="text-[10px] text-slate-500">Total</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          {segments.map((segment) => (
            <div
              key={segment.label}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-sm"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-slate-700">{segment.label}</span>
              </div>
              <span className="font-mono text-xs text-slate-500">
                {total > 0
                  ? `${Math.round((segment.value / total) * 100)}%`
                  : '0%'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
