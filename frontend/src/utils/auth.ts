export type UserRole = 'Admin' | 'Staff' | 'Technician';

export interface CurrentUser {
  id: number;
  role: UserRole;
  name: string;
  email: string;
  token: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
}

const ROLE_ALIASES: Record<string, UserRole> = {
  ADMIN: 'Admin',
  ADMINISTRATOR: 'Admin',
  Admin: 'Admin',
  STAFF: 'Staff',
  STAFF_USER: 'Staff',
  Staff: 'Staff',
  TECHNICIAN: 'Technician',
  Technician: 'Technician',
};

export function normalizeUserRole(role: string | undefined): UserRole | null {
  if (!role) {
    return null;
  }

  return ROLE_ALIASES[role] ?? ROLE_ALIASES[role.toUpperCase()] ?? null;
}

function toCurrentUser(data: NonNullable<LoginResponse['data']>): CurrentUser {
  const role = normalizeUserRole(data.user.role);

  if (!role) {
    throw new Error('Invalid user role returned from server');
  }

  return {
    id: data.user.id,
    role,
    name: data.user.name,
    email: data.user.email,
    token: data.token,
  };
}

export async function loginRequest(
  email: string,
  password: string,
  role: string,
): Promise<CurrentUser> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });

  const data = (await response.json()) as LoginResponse;

  if (!response.ok || !data.success || !data.data) {
    throw new Error(data.message || 'Login failed');
  }

  const user = toCurrentUser(data.data);

  sessionStorage.setItem('oamms_user', JSON.stringify(user));
  return user;
}

export function setCurrentUser(user: CurrentUser) {
  sessionStorage.setItem('oamms_user', JSON.stringify(user));
}

export function getCurrentUser(): CurrentUser | null {
  const stored = sessionStorage.getItem('oamms_user');
  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<CurrentUser>;
    const role = normalizeUserRole(parsed.role);

    if (!parsed.token || !role || !parsed.name || !parsed.email) {
      return null;
    }

    return {
      id: Number(parsed.id) || 0,
      role,
      name: parsed.name,
      email: parsed.email,
      token: parsed.token,
    };
  } catch {
    return null;
  }
}

export function logoutUser() {
  sessionStorage.removeItem('oamms_user');
}

export function hasRole(
  user: CurrentUser | null,
  ...roles: UserRole[]
): boolean {
  return Boolean(user && roles.includes(user.role));
}
