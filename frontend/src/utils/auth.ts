export type UserRole = 'Admin' | 'Staff' | 'Technician';

export interface CurrentUser {
  role: UserRole;
  name: string;
}

const ROLE_MAP: Record<string, UserRole> = {
  ADMINISTRATOR: 'Admin',
  STAFF_USER: 'Staff',
  TECHNICIAN: 'Technician',
};

const DEFAULT_USERS: Record<UserRole, CurrentUser> = {
  Admin: { role: 'Admin', name: 'Alice Mensah' },
  Staff: { role: 'Staff', name: 'Bob Nkosi' },
  Technician: { role: 'Technician', name: 'James Okafor' },
};

export function setCurrentUser(roleKey: string, name?: string) {
  const role = ROLE_MAP[roleKey] ?? 'Admin';
  const user = {
    role,
    name: name ?? DEFAULT_USERS[role].name,
  };
  sessionStorage.setItem('oamms_user', JSON.stringify(user));
}

export function getCurrentUser(): CurrentUser {
  const stored = sessionStorage.getItem('oamms_user');
  if (stored) {
    return JSON.parse(stored) as CurrentUser;
  }
  return DEFAULT_USERS.Admin;
}
