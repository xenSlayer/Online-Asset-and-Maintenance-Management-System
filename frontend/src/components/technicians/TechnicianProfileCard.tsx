import type { Technician } from '../../types/technician';
import { AvailabilityBadge } from './AvailabilityBadge';
import { TechnicianAvatar } from './TechnicianAvatar';

interface TechnicianProfileCardProps {
  technician: Technician;
}

const infoTiles = (technician: Technician) => [
  { emoji: '🪪', label: 'Technician ID', value: technician.id },
  { emoji: '✉', label: 'Email', value: technician.email },
  { emoji: '📱', label: 'Phone', value: technician.phone },
  { emoji: '🔧', label: 'Active Tasks', value: String(technician.activeTasks) },
];

export function TechnicianProfileCard({ technician }: TechnicianProfileCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-4">
        <TechnicianAvatar
          name={technician.name}
          color={technician.avatarColor}
          size="lg"
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900">{technician.name}</h2>
          <p className="text-sm text-slate-500">
            {technician.specialisation} Specialist
          </p>
          <div className="mt-2">
            <AvailabilityBadge availability={technician.availability} />
          </div>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {infoTiles(technician).map((tile) => (
          <div key={tile.label} className="rounded-xl bg-slate-50 p-3.5">
            <p className="mb-1 text-xs uppercase tracking-wider text-slate-400">
              {tile.emoji} {tile.label}
            </p>
            <p
              className={`text-sm font-semibold text-slate-800 ${
                tile.label === 'Technician ID' ? 'font-mono text-xs' : ''
              }`}
            >
              {tile.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
