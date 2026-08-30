interface RecordsSummaryCardsProps {
  totalRecords: number;
  totalCostYtdDisplay: string;
  avgCostDisplay: string;
}

export function RecordsSummaryCards({
  totalRecords,
  totalCostYtdDisplay,
  avgCostDisplay,
}: RecordsSummaryCardsProps) {
  const summaryCards = [
    { label: 'Total Records', value: String(totalRecords), color: '#4F46E5' },
    {
      label: 'Total Repair Cost (YTD)',
      value: totalCostYtdDisplay,
      color: '#059669',
    },
    { label: 'Avg Cost per Record', value: avgCostDisplay, color: '#2563EB' },
  ];

  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {summaryCards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {card.label}
          </p>
          <p className="text-2xl font-bold" style={{ color: card.color }}>
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
