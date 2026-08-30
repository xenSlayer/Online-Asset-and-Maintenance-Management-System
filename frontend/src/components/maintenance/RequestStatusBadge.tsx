import type { RequestStatus } from '../../types/maintenanceRequest';

const statusStyles: Record<
  RequestStatus,
  { badge: string; dot: string }
> = {
  Pending: {
    badge: 'bg-[#FFFBEB] text-[#D97706]',
    dot: 'bg-[#D97706]',
  },
  Assigned: {
    badge: 'bg-[#EFF6FF] text-[#2563EB]',
    dot: 'bg-[#2563EB]',
  },
  'In Progress': {
    badge: 'bg-[#EEF2FF] text-[#4F46E5]',
    dot: 'bg-[#4F46E5]',
  },
  Completed: {
    badge: 'bg-[#ECFDF5] text-[#059669]',
    dot: 'bg-[#059669]',
  },
};

interface RequestStatusBadgeProps {
  status: RequestStatus;
}

export function RequestStatusBadge({ status }: RequestStatusBadgeProps) {
  const styles = statusStyles[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${styles.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      {status}
    </span>
  );
}
