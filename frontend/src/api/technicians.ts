import type { Technician, TechnicianDetail } from '../types/technician';
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
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = (await response.json()) as ApiResponse<T>;

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'Request failed');
  }

  return data.data as T;
}

export async function fetchTechnicians(): Promise<Technician[]> {
  const response = await fetch('/api/technicians', {
    headers: authHeaders(),
  });

  return parseResponse<Technician[]>(response);
}

export async function fetchTechnician(id: string): Promise<TechnicianDetail> {
  const response = await fetch(`/api/technicians/${encodeURIComponent(id)}`, {
    headers: authHeaders(),
  });

  return parseResponse<TechnicianDetail>(response);
}

export interface UpdateTechnicianInput {
  name: string;
  email: string;
  phone?: string;
  specialisation: string;
  status: string;
  password?: string;
}

export async function updateTechnician(
  id: string,
  input: UpdateTechnicianInput,
): Promise<TechnicianDetail> {
  const response = await fetch(`/api/technicians/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: {
      ...authHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  return parseResponse<TechnicianDetail>(response);
}
