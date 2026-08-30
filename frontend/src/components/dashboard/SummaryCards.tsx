interface SummaryCardProps {
  label: string;
  value: string;
  icon: string;
  iconBg: string;
  valueColor: string;
  delta?: {
    text: string;
    className: string;
  };
  subtitle?: string;
}

const cards: SummaryCardProps[] = [
  {
    label: 'Total Users',
    value: '48',
    icon: '👥',
    iconBg: '#EEF2FF',
    valueColor: '#4F46E5',
    delta: { text: '↑ +3', className: 'bg-emerald-50 text-emerald-600' },
  },
  {
    label: 'Total Assets',
    value: '214',
    icon: '🗄',
    iconBg: '#EFF6FF',
    valueColor: '#2563EB',
    delta: { text: '↑ +12', className: 'bg-emerald-50 text-emerald-600' },
  },
  {
    label: 'Pending Requests',
    value: '17',
    icon: '⏳',
    iconBg: '#FFFBEB',
    valueColor: '#D97706',
    delta: { text: '↓ 5 high priority', className: 'bg-red-50 text-red-500' },
  },
  {
    label: 'Completed Tasks',
    value: '89',
    icon: '✅',
    iconBg: '#ECFDF5',
    valueColor: '#059669',
    delta: { text: '↑ This quarter', className: 'bg-emerald-50 text-emerald-600' },
  },
  {
    label: 'Available Technicians',
    value: '6',
    icon: '👷',
    iconBg: '#F5F3FF',
    valueColor: '#7C3AED',
    subtitle: '2 on assignment',
  },
];

function SummaryCard({
  label,
  value,
  icon,
  iconBg,
  valueColor,
  delta,
  subtitle,
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div
          className="flex h-10 w-10 items-center justify-center rounded-xl text-lg"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
        {delta && (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${delta.className}`}
          >
            {delta.text}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold" style={{ color: valueColor }}>
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-500">{label}</p>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-400">{subtitle}</p>
      )}
    </div>
  );
}

export function SummaryCards() {
  return (
    <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-5">
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </div>
  );
}
