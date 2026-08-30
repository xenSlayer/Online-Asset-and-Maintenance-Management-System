import type { TechnicianAvailability } from '../../types/technician';

const availabilityStyles: Record<
  TechnicianAvailability,
  { badge: string; dot: string }
> = {
  Available: {
    badge: 'bg-[#ECFDF5] text-[#059669]',
    dot: 'bg-emerald-500',
  },
  'On Assignment': {
    badge: 'bg-[#FFFBEB] text-[#D97706]',
    dot: 'bg-amber-500',
  },
};

interface AvailabilityBadgeProps {
  availability: TechnicianAvailability;
}

export function AvailabilityBadge({ availability }: AvailabilityBadgeProps) {
  const styles = availabilityStyles[availability];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      {availability}
    </span>
  );
}

export function AvailabilityDot({
  availability,
}: {
  availability: TechnicianAvailability;
}) {
  return (
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${
        availability === 'Available' ? 'bg-emerald-400' : 'bg-amber-400'
      }`}
    />
  );
}
