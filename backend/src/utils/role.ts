export const ROLE_MAP: Record<string, string> = {
  ADMINISTRATOR: 'ADMIN',
  STAFF_USER: 'STAFF',
  TECHNICIAN: 'TECHNICIAN',
};

export const FRONTEND_ROLE_MAP: Record<string, string> = {
  ADMIN: 'Admin',
  STAFF: 'Staff',
  TECHNICIAN: 'Technician',
};

export function toDatabaseRole(roleKey: string): string {
  return ROLE_MAP[roleKey] ?? roleKey.toUpperCase();
}

export function toFrontendRole(dbRole: string): string {
  return FRONTEND_ROLE_MAP[dbRole] ?? dbRole;
}
