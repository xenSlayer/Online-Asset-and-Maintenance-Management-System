import { Search } from 'lucide-react';
import type { AssetCategory, AssetStatus } from '../../types/asset';

export type CategoryFilter = 'All Categories' | AssetCategory;
export type StatusFilter = 'All Statuses' | AssetStatus;

interface AssetSearchFilterProps {
  searchQuery: string;
  categoryFilter: CategoryFilter;
  statusFilter: StatusFilter;
  onSearchChange: (value: string) => void;
  onCategoryFilterChange: (value: CategoryFilter) => void;
  onStatusFilterChange: (value: StatusFilter) => void;
}

const categories: CategoryFilter[] = [
  'All Categories',
  'Mechanical',
  'Electrical',
  'IT Equipment',
  'Vehicle',
  'Office Equipment',
];

const statuses: StatusFilter[] = [
  'All Statuses',
  'Operational',
  'Under Maintenance',
  'Out of Service',
  'Retired',
];

const selectClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100';

export function AssetSearchFilter({
  searchQuery,
  categoryFilter,
  statusFilter,
  onSearchChange,
  onCategoryFilterChange,
  onStatusFilterChange,
}: AssetSearchFilterProps) {
  return (
    <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Search Assets
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
              placeholder="Name, ID, serial…"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div className="w-48">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Category
          </label>
          <select
            value={categoryFilter}
            onChange={(event) =>
              onCategoryFilterChange(event.target.value as CategoryFilter)
            }
            className={selectClass}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="w-48">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Status
          </label>
          <select
            value={statusFilter}
            onChange={(event) =>
              onStatusFilterChange(event.target.value as StatusFilter)
            }
            className={selectClass}
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
