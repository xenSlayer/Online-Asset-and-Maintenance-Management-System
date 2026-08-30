import { Search } from 'lucide-react';

interface TopBarProps {
  pageTitle: string;
}

export function TopBar({ pageTitle }: TopBarProps) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white px-8 py-3.5 shadow-sm">
      <div className="text-sm">
        <span className="text-slate-400">OA System</span>
        <span className="mx-2 text-slate-400">/</span>
        <span className="font-medium text-slate-800">{pageTitle}</span>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            placeholder="Search…"
            className="h-9 w-48 rounded-lg border-0 bg-slate-50 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </div>

        <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-medium text-slate-600">admin</span>
        </div>
      </div>
    </header>
  );
}
