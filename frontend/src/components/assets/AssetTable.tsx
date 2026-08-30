import type { Asset } from '../../types/asset';
import { getCategoryEmoji } from '../../utils/asset';
import { AssetStatusBadge } from './AssetStatusBadge';

interface AssetTableProps {
  assets: Asset[];
  totalCount: number;
  onView: (asset: Asset) => void;
  onEdit: (asset: Asset) => void;
}

export function AssetTable({
  assets,
  totalCount,
  onView,
  onEdit,
}: AssetTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="border-b border-slate-200 bg-[#F8FAFC]">
            <tr>
              {[
                'Asset',
                'Category',
                'Serial No.',
                'Location',
                'Status',
                'Assigned To',
                'Actions',
              ].map((header) => (
                <th
                  key={header}
                  className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assets.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-8 text-center text-sm text-slate-400"
                >
                  No assets found
                </td>
              </tr>
            ) : (
              assets.map((asset) => (
              <tr
                key={asset.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg">
                      {getCategoryEmoji(asset.category)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {asset.name}
                      </p>
                      <p className="font-mono text-xs text-slate-400">
                        {asset.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {asset.category}
                </td>
                <td className="px-5 py-4 font-mono text-xs text-slate-500">
                  {asset.serialNo || '—'}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {asset.location}
                </td>
                <td className="px-5 py-4">
                  <AssetStatusBadge status={asset.status} />
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {asset.assignedTo}
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onView(asset)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(asset)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                      Edit
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
        <p className="text-xs text-slate-400">
          Showing {assets.length} of {totalCount} assets
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            ← Prev
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
