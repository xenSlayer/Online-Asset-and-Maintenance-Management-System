import type { StatusTab } from '../../types/maintenanceRequest';

interface StatusTabsProps {
  activeTab: StatusTab;
  onTabChange: (tab: StatusTab) => void;
  tabs: { key: StatusTab; label: string; count: number }[];
}

export function StatusTabs({ activeTab, onTabChange, tabs }: StatusTabsProps) {
  return (
    <div className="mb-5 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="flex min-w-max gap-1 border-b border-slate-200 sm:min-w-0 sm:flex-wrap">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors sm:px-4 ${
              isActive
                ? 'border-[#4F46E5] text-[#4F46E5]'
                : 'border-transparent text-[#64748B] hover:text-[#334155]'
            }`}
          >
            {tab.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'bg-slate-100 text-slate-500'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
        })}
      </div>
    </div>
  );
}
