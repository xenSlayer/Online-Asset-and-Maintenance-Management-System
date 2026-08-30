import type { MaintenanceRecord } from '../../types/maintenanceRecord';
import { getCategoryEmoji } from '../../utils/asset';
import { getInitials } from '../../utils/avatar';

interface RecordsTableProps {
  records: MaintenanceRecord[];
  totalRecords?: number;
}

function TechnicianCell({
  name,
  color,
}: {
  name: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
        style={{ backgroundColor: color }}
      >
        {getInitials(name)}
      </div>
      <span className="text-sm text-slate-600">{name}</span>
    </div>
  );
}

export function RecordsTable({ records, totalRecords }: RecordsTableProps) {
  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead className="border-b border-slate-200 bg-[#F8FAFC]">
            <tr>
              {[
                'Record ID',
                'Request',
                'Asset',
                'Technician',
                'Description',
                'Parts Replaced',
                'Date',
                'Cost',
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
            {records.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-5 py-12 text-center text-sm text-slate-500"
                >
                  No maintenance records found.
                </td>
              </tr>
            ) : (
              records.map((record) => (
              <tr
                key={record.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <span className="font-mono text-xs font-semibold text-[#4F46E5]">
                    {record.id}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="font-mono text-xs text-slate-500">
                    {record.requestId}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {getCategoryEmoji(record.assetCategory)}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {record.assetName}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <TechnicianCell
                    name={record.technician}
                    color={record.technicianColor}
                  />
                </td>
                <td className="max-w-[200px] truncate px-5 py-4 text-sm text-slate-600">
                  {record.description}
                </td>
                <td className="max-w-[140px] truncate px-5 py-4 text-xs text-slate-500">
                  {record.partsReplaced}
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-slate-500">
                  {record.date}
                </td>
                <td className="px-5 py-4 text-sm font-bold text-[#059669]">
                  {record.costDisplay}
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
        <p className="text-xs text-slate-400">
          Showing {records.length} of {totalRecords ?? records.length} records
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
