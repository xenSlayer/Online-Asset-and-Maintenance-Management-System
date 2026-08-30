export interface PublicStats {
  totalAssets: number;
  completedTasks: number;
  activeTechnicians: number;
}

interface StatsResponse {
  success: boolean;
  message?: string;
  data?: PublicStats;
}

export async function fetchPublicStats(): Promise<PublicStats> {
  const response = await fetch('/api/stats');
  const data = (await response.json()) as StatsResponse;

  if (!response.ok || !data.success || !data.data) {
    throw new Error(data.message || 'Failed to load stats');
  }

  return data.data;
}
