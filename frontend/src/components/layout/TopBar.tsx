import { Menu } from 'lucide-react';
import { getCurrentUser } from '../../utils/auth';

interface TopBarProps {
  pageTitle: string;
  onMenuClick?: () => void;
}

export function TopBar({ pageTitle, onMenuClick }: TopBarProps) {
  const user = getCurrentUser();

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-slate-200 bg-white px-4 py-3 shadow-sm sm:px-6 lg:px-8 lg:py-3.5">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0 truncate text-sm">
          <span className="hidden text-slate-400 sm:inline">OA System</span>
          <span className="mx-2 hidden text-slate-400 sm:inline">/</span>
          <span className="font-medium text-slate-800">{pageTitle}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="max-w-[120px] truncate text-xs font-medium text-slate-600 sm:max-w-none">
          {user?.name ?? 'User'}
        </span>
      </div>
    </header>
  );
}
