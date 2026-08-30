import type { DashboardData } from '../types/dashboard';
import { getCurrentUser } from '../utils/auth';

interface DashboardResponse {
  success: boolean;
  message?: string;
  data?: DashboardData;
}

export async function fetchDashboard(): Promise<DashboardData> {
  const user = getCurrentUser();

  if (!user?.token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch('/api/dashboard', {
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });

  const data = (await response.json()) as DashboardResponse;

  if (!response.ok || !data.success || !data.data) {
    throw new Error(data.message || 'Failed to load dashboard');
  }

  return data.data;
}
