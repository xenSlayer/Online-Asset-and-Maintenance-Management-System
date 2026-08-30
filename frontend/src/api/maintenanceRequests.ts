import type { MaintenanceRequest, RequestPriority } from '../types/maintenanceRequest';
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

export async function fetchMaintenanceRequests(): Promise<MaintenanceRequest[]> {
  const response = await fetch('/api/maintenance-requests', {
    headers: authHeaders(),
  });

  return parseResponse<MaintenanceRequest[]>(response);
}

export interface CreateMaintenanceRequestInput {
  assetId: string;
  description: string;
  priority: RequestPriority;
  requestDate?: string;
}

export async function createMaintenanceRequest(
  input: CreateMaintenanceRequestInput,
): Promise<MaintenanceRequest> {
  const response = await fetch('/api/maintenance-requests', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(input),
  });

  return parseResponse<MaintenanceRequest>(response);
}

export async function approveMaintenanceRequest(
  id: string,
): Promise<MaintenanceRequest> {
  const response = await fetch(
    `/api/maintenance-requests/${encodeURIComponent(id)}/approve`,
    {
      method: 'PATCH',
      headers: authHeaders(),
    },
  );

  return parseResponse<MaintenanceRequest>(response);
}

export async function assignMaintenanceRequest(
  id: string,
  technicianId: string,
): Promise<MaintenanceRequest> {
  const response = await fetch(
    `/api/maintenance-requests/${encodeURIComponent(id)}/assign`,
    {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ technicianId }),
    },
  );

  return parseResponse<MaintenanceRequest>(response);
}

export async function rejectMaintenanceRequest(
  id: string,
): Promise<{ id: string }> {
  const response = await fetch(
    `/api/maintenance-requests/${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: authHeaders(),
    },
  );

  return parseResponse<{ id: string }>(response);
}

export async function progressMaintenanceRequest(
  id: string,
): Promise<MaintenanceRequest> {
  const response = await fetch(
    `/api/maintenance-requests/${encodeURIComponent(id)}/progress`,
    {
      method: 'PATCH',
      headers: authHeaders(),
    },
  );

  return parseResponse<MaintenanceRequest>(response);
}

export async function completeMaintenanceRequest(
  id: string,
  input?: { cost?: number; partsReplaced?: string; repairDescription?: string },
): Promise<MaintenanceRequest> {
  const response = await fetch(
    `/api/maintenance-requests/${encodeURIComponent(id)}/complete`,
    {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(input ?? {}),
    },
  );

  return parseResponse<MaintenanceRequest>(response);
}
