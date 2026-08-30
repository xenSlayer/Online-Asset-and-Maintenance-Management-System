import type { Technician } from '../../types/technician';
import { AvailabilityDot } from './AvailabilityBadge';
import { TechnicianAvatar } from './TechnicianAvatar';

interface TechnicianListProps {
  technicians: Technician[];
  selectedId: string | null;
  onSelect: (technician: Technician) => void;
}

export function TechnicianList({
  technicians,
  selectedId,
  onSelect,
}: TechnicianListProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {technicians.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-slate-400">
          No technicians found. Add a user with the Technician role.
        </p>
      ) : (
        technicians.map((technician) => {
        const isSelected = technician.id === selectedId;

        return (
          <button
            key={technician.id}
            type="button"
            onClick={() => onSelect(technician)}
            className={`flex w-full items-center gap-3 border-b border-slate-100 px-4 py-3.5 text-left transition-colors last:border-0 hover:bg-slate-50 ${
              isSelected ? 'bg-[#EEF2FF]' : 'bg-white'
            }`}
          >
            <TechnicianAvatar
              name={technician.name}
              color={technician.avatarColor}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {technician.name}
              </p>
              <p className="text-xs text-slate-400">
                {technician.specialisation}
              </p>
            </div>
            <AvailabilityDot availability={technician.availability} />
          </button>
        );
      })
      )}
    </div>
  );
}
