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
      role: UserRole;
    };
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

  const user: CurrentUser = {
    id: data.data.user.id,
    role: data.data.user.role,
    name: data.data.user.name,
    email: data.data.user.email,
    token: data.data.token,
  };

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

  return JSON.parse(stored) as CurrentUser;
}

export function logoutUser() {
  sessionStorage.removeItem('oamms_user');
}
