import { Search } from 'lucide-react';

export type RoleFilter = 'All' | 'Admin' | 'Staff' | 'Technician';

interface UserSearchFilterProps {
  searchQuery: string;
  roleFilter: RoleFilter;
  onSearchChange: (value: string) => void;
  onRoleFilterChange: (value: RoleFilter) => void;
}

export function UserSearchFilter({
  searchQuery,
  roleFilter,
  onSearchChange,
  onRoleFilterChange,
}: UserSearchFilterProps) {
  return (
    <div className="mb-5 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Search Users
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
              placeholder="Name, email, ID…"
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
            />
          </div>
        </div>

        <div className="w-48">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
            Filter by Role
          </label>
          <select
            value={roleFilter}
            onChange={(event) =>
              onRoleFilterChange(event.target.value as RoleFilter)
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="All">All</option>
            <option value="Admin">Admin</option>
            <option value="Staff">Staff</option>
            <option value="Technician">Technician</option>
          </select>
        </div>
      </div>
    </div>
  );
}
