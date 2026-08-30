import type { AssetStatus } from '../../types/asset';

const statusStyles: Record<AssetStatus, string> = {
  Operational: 'bg-emerald-50 text-emerald-700',
  'Under Maintenance': 'bg-amber-50 text-amber-600',
  'Out of Service': 'bg-red-50 text-red-600',
  Retired: 'bg-slate-100 text-slate-500',
};

interface AssetStatusBadgeProps {
  status: AssetStatus;
}

export function AssetStatusBadge({ status }: AssetStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
