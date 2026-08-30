import { Badge } from '../ui';

type Priority = 'High' | 'Medium' | 'Low';
type Status = 'Pending' | 'Assigned' | 'In Progress' | 'Completed';

interface RequestRow {
  id: string;
  asset: string;
  priority: Priority;
  status: Status;
  submittedBy: string;
}

const requests: RequestRow[] = [
  {
    id: 'MR-0041',
    asset: 'HVAC Unit 3',
    priority: 'High',
    status: 'Pending',
    submittedBy: 'Bob Nkosi',
  },
  {
    id: 'MR-0040',
    asset: 'Printer B2',
    priority: 'Medium',
    status: 'Assigned',
    submittedBy: 'Eva Osei',
  },
  {
    id: 'MR-0039',
    asset: 'Server Rack A',
    priority: 'High',
    status: 'In Progress',
    submittedBy: 'Alice Mensah',
  },
  {
    id: 'MR-0038',
    asset: 'Forklift #7',
    priority: 'Low',
    status: 'Completed',
    submittedBy: 'Bob Nkosi',
  },
];

const priorityStyles: Record<Priority, string> = {
  High: 'bg-red-50 text-red-600',
  Medium: 'bg-amber-50 text-amber-600',
  Low: 'bg-emerald-50 text-emerald-700',
};

const statusStyles: Record<
  Status,
  { className: string; dot: string; iconBg: string; iconColor: string }
> = {
  Pending: {
    className: 'bg-amber-50 text-amber-600',
    dot: 'bg-amber-500',
    iconBg: '#FFFBEB',
    iconColor: '#D97706',
  },
  Assigned: {
    className: 'bg-blue-50 text-blue-600',
    dot: 'bg-blue-500',
    iconBg: '#EFF6FF',
    iconColor: '#2563EB',
  },
  'In Progress': {
    className: 'bg-indigo-50 text-indigo-600',
    dot: 'bg-indigo-500',
    iconBg: '#EEF2FF',
    iconColor: '#4F46E5',
  },
  Completed: {
    className: 'bg-emerald-50 text-emerald-600',
    dot: 'bg-emerald-500',
    iconBg: '#ECFDF5',
    iconColor: '#059669',
  },
};

export function RecentRequests() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-800">
          Recent Maintenance Requests
        </h3>
        <button
          type="button"
          className="text-sm text-slate-500 transition-colors hover:text-slate-800"
        >
          View all →
        </button>
      </div>

      <div className="divide-y divide-slate-100">
        {requests.map((request) => {
          const statusStyle = statusStyles[request.status];

          return (
            <div
              key={request.id}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm"
                  style={{
                    backgroundColor: statusStyle.iconBg,
                    color: statusStyle.iconColor,
                  }}
                >
                  🔧
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {request.asset}
                  </p>
                  <p className="font-mono text-xs text-slate-400">
                    {request.id} · {request.submittedBy}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Badge className={priorityStyles[request.priority]}>
                  {request.priority}
                </Badge>
                <Badge className={statusStyle.className}>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`}
                  />
                  {request.status}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
