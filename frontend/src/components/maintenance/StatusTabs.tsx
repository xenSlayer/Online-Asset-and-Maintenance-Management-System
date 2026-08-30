import type { StatusTab } from '../../types/maintenanceRequest';

interface StatusTabsProps {
  activeTab: StatusTab;
  onTabChange: (tab: StatusTab) => void;
  tabs: { key: StatusTab; label: string; count: number }[];
}

export function StatusTabs({ activeTab, onTabChange, tabs }: StatusTabsProps) {
  return (
    <div className="mb-5 flex gap-1 border-b border-slate-200">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={`-mb-px flex items-center gap-1.5 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
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
  );
}
