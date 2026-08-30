import type { MaintenanceRecord } from '../types/maintenanceRecord';
import { getCurrentUser } from '../utils/auth';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface MaintenanceRecordsData {
  records: MaintenanceRecord[];
  summary: {
    totalRecords: number;
    totalCostYtd: number;
    totalCostYtdDisplay: string;
    avgCost: number;
    avgCostDisplay: string;
  };
  chartData: { month: string; value: number }[];
  assetNames: string[];
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

export async function fetchMaintenanceRecords(): Promise<MaintenanceRecordsData> {
  const response = await fetch('/api/maintenance-records', {
    headers: authHeaders(),
  });

  return parseResponse<MaintenanceRecordsData>(response);
}
