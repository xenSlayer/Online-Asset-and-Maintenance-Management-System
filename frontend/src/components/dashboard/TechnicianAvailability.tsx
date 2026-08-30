import { Avatar } from '../ui';

const technicians = [
  {
    name: 'James Okafor',
    specialisation: 'Electrical',
    statusColor: 'bg-emerald-400',
  },
  {
    name: 'Maria Santos',
    specialisation: 'Mechanical',
    statusColor: 'bg-amber-400',
  },
  {
    name: 'David Chen',
    specialisation: 'HVAC',
    statusColor: 'bg-emerald-400',
  },
  {
    name: 'Priya Nair',
    specialisation: 'IT / Electronics',
    statusColor: 'bg-amber-400',
  },
];

export function TechnicianAvailability() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-slate-800">
        Technician Availability
      </h3>

      <div className="space-y-3">
        {technicians.map((technician) => (
          <div
            key={technician.name}
            className="flex items-center justify-between gap-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <Avatar name={technician.name} />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-800">
                  {technician.name}
                </p>
                <p className="text-xs text-slate-400">
                  {technician.specialisation}
                </p>
              </div>
            </div>
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${technician.statusColor}`}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-lg py-2 text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
      >
        Manage Technicians →
      </button>
    </div>
  );
}
