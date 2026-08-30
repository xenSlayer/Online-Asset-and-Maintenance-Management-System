import type { DashboardMonthPoint } from '../../types/dashboard';

interface MaintenanceBarChartProps {
  data: DashboardMonthPoint[];
  total: number;
  periodLabel: string;
}

export function MaintenanceBarChart({
  data,
  total,
  periodLabel,
}: MaintenanceBarChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const chartHeight = 112;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            Maintenance Requests
          </h3>
          <p className="text-xs text-slate-400">{periodLabel}</p>
        </div>
        <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-600">
          {total} total
        </span>
      </div>

      <div className="flex items-end justify-between gap-2">
        {data.map((item) => {
          const barHeight = (item.value / maxValue) * chartHeight;

          return (
            <div
              key={item.month}
              className="flex flex-1 flex-col items-center"
            >
              <span className="mb-1 text-xs font-semibold text-slate-600">
                {item.value}
              </span>
              <div
                className="w-full rounded-t-md bg-[#7C3AED]"
                style={{ height: `${barHeight}px` }}
              />
              <span className="mt-2 text-xs text-slate-400">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
