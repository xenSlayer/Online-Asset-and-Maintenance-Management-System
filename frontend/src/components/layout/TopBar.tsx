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

      <div className="flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="text-xs font-medium text-slate-600">admin</span>
      </div>
    </header>
  );
}
