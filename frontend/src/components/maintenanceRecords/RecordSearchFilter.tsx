import { Search } from 'lucide-react';

export type AssetFilter = 'All Assets' | string;

interface RecordSearchFilterProps {
  searchQuery: string;
  assetFilter: AssetFilter;
  assetOptions: string[];
  fromDate: string;
  toDate: string;
  onSearchChange: (value: string) => void;
  onAssetFilterChange: (value: AssetFilter) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100';

export function RecordSearchFilter({
  searchQuery,
  assetFilter,
  assetOptions,
  fromDate,
  toDate,
  onSearchChange,
  onAssetFilterChange,
  onFromDateChange,
  onToDateChange,
}: RecordSearchFilterProps) {
  return (
    <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-0 w-full flex-1 basis-full sm:min-w-[200px] sm:basis-auto">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Search Records
          </label>
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Record ID, asset, technician…"
              className={`${inputClass} pl-9`}
            />
          </div>
        </div>

        <div className="w-full sm:w-44">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Asset
          </label>
          <select
            value={assetFilter}
            onChange={(event) =>
              onAssetFilterChange(event.target.value as AssetFilter)
            }
            className={inputClass}
          >
            <option value="All Assets">All Assets</option>
            {assetOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-40">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            From Date
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(event) => onFromDateChange(event.target.value)}
            className={inputClass}
          />
        </div>

        <div className="w-full sm:w-40">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            To Date
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(event) => onToDateChange(event.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  );
}
