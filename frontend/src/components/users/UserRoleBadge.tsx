import type { UserRole } from '../../types/user';

const roleStyles: Record<UserRole, string> = {
  Admin: 'bg-violet-100 text-violet-700',
  Staff: 'bg-blue-50 text-blue-600',
  Technician: 'bg-emerald-50 text-emerald-700',
};

interface UserRoleBadgeProps {
  role: UserRole;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${roleStyles[role]}`}
    >
      {role}
    </span>
  );
}
