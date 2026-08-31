import type { Asset } from '../../types/asset';
import { formatDisplayDate } from '../../utils/date';
import { getCategoryEmoji } from '../../utils/asset';
import { AssetStatusBadge } from './AssetStatusBadge';

interface AssetDetailProps {
  asset: Asset;
  onBack: () => void;
  onEdit: () => void;
}

const infoRows = (asset: Asset) => [
  { label: 'Asset ID', value: asset.id },
  { label: 'Serial No.', value: asset.serialNo || '—' },
  { label: 'Category', value: asset.category },
  { label: 'Purchase Date', value: formatDisplayDate(asset.purchaseDate) },
  { label: 'Location', value: asset.location },
  { label: 'Assigned To', value: asset.assignedTo },
];

export function AssetDetail({ asset, onBack, onEdit }: AssetDetailProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-5 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800"
      >
        ← Back to Assets
      </button>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{asset.name}</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {asset.id} · {asset.category}
          </p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Edit Asset
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1">
          <div className="flex h-36 w-full items-center justify-center rounded-xl bg-slate-100 text-5xl">
            {getCategoryEmoji(asset.category)}
          </div>

          <div className="mt-4">
            <AssetStatusBadge status={asset.status} />
          </div>

          <dl className="mt-4 space-y-3">
            {infoRows(asset).map((row) => (
              <div
                key={row.label}
                className="flex justify-between border-b border-slate-100 py-2 text-sm last:border-0"
              >
                <dt className="text-slate-500">{row.label}</dt>
                <dd
                  className={`font-semibold text-slate-800 ${row.label === 'Asset ID' || row.label === 'Serial No.' ? 'font-mono text-xs' : ''}`}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-slate-800">
              Description
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {asset.description}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-sm font-bold text-slate-800">
              Maintenance History
            </h2>
            <div className="space-y-4">
              {asset.maintenanceHistory.length === 0 ? (
                <p className="text-sm text-slate-400">No maintenance history yet</p>
              ) : (
                asset.maintenanceHistory.map((item) => (
                <div
                  key={`${item.date}-${item.description}`}
                  className="flex gap-4 border-b border-slate-100 pb-4 last:border-0"
                >
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#059669]" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm font-semibold text-slate-800">
                        {item.description}
                      </p>
                      <p className="text-sm font-bold text-[#4F46E5]">
                        {item.cost}
                      </p>
                    </div>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {item.date} · {item.technician}
                    </p>
                  </div>
                </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
