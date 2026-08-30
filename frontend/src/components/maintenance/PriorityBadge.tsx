import type { RequestPriority } from '../../types/maintenanceRequest';

const priorityStyles: Record<RequestPriority, string> = {
  Critical: 'bg-[#FEE2E2] text-[#991B1B]',
  High: 'bg-[#FEF2F2] text-[#DC2626]',
  Medium: 'bg-[#FFFBEB] text-[#D97706]',
  Low: 'bg-[#ECFDF5] text-[#059669]',
};

interface PriorityBadgeProps {
  priority: RequestPriority;
  className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${priorityStyles[priority]} ${className}`}
    >
      {priority}
    </span>
  );
}

export function getPriorityStyle(priority: RequestPriority): string {
  return priorityStyles[priority];
}
