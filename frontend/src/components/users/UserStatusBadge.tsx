import type { UserStatus } from '../../types/user';

const statusStyles: Record<
  UserStatus,
  { badge: string; dot: string }
> = {
  Active: {
    badge: 'bg-emerald-50 text-emerald-600',
    dot: 'bg-emerald-500',
  },
  Inactive: {
    badge: 'bg-slate-100 text-slate-500',
    dot: 'bg-slate-400',
  },
  Suspended: {
    badge: 'bg-red-50 text-red-600',
    dot: 'bg-red-500',
  },
};

interface UserStatusBadgeProps {
  status: UserStatus;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
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
