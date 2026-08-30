import { Link } from 'react-router-dom';
import type { DashboardTechnician } from '../../types/dashboard';
import { Avatar } from '../ui';

interface TechnicianAvailabilityProps {
  technicians: DashboardTechnician[];
}

export function TechnicianAvailability({
  technicians,
}: TechnicianAvailabilityProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-slate-800">
        Technician Availability
      </h3>

      {technicians.length === 0 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          No technicians available
        </p>
      ) : (
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
                className={`h-2 w-2 shrink-0 rounded-full ${
                  technician.availability === 'Available'
                    ? 'bg-emerald-400'
                    : 'bg-amber-400'
                }`}
              />
            </div>
          ))}
        </div>
      )}

      <Link
        to="/technicians"
        className="mt-4 block w-full rounded-lg py-2 text-center text-sm text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
      >
        Manage Technicians →
      </Link>
    </div>
  );
}
