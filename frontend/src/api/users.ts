import type { User, UserRole, UserStatus } from '../types/user';
import { getCurrentUser } from '../utils/auth';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

function authHeaders() {
  const user = getCurrentUser();

  if (!user?.token) {
    throw new Error('Not authenticated');
  }

  return {
    Authorization: `Bearer ${user.token}`,
    'Content-Type': 'application/json',
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Request failed');
  }

  return data.data as T;
}

export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users', {
    headers: authHeaders(),
  });

  return parseResponse<User[]>(response);
}

export interface SaveUserInput {
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: UserStatus;
  password?: string;
}

export async function createUser(input: SaveUserInput): Promise<User> {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(input),
  });

  return parseResponse<User>(response);
}

export async function updateUser(
  id: string,
  input: Partial<SaveUserInput>,
): Promise<User> {
  const response = await fetch(`/api/users/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(input),
  });

  return parseResponse<User>(response);
}

export async function deactivateUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}/deactivate`, {
    method: 'PATCH',
    headers: authHeaders(),
  });

  return parseResponse<User>(response);
}
