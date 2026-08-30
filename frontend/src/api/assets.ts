import type { Asset, AssetCategory, AssetStatus } from '../types/asset';
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

export async function fetchAssets(): Promise<Asset[]> {
  const response = await fetch('/api/assets', {
    headers: authHeaders(),
  });

  return parseResponse<Asset[]>(response);
}

export async function fetchAsset(id: string): Promise<Asset> {
  const response = await fetch(`/api/assets/${encodeURIComponent(id)}`, {
    headers: authHeaders(),
  });

  return parseResponse<Asset>(response);
}

export interface SaveAssetInput {
  name: string;
  category: AssetCategory;
  serialNo?: string;
  description?: string;
  location: string;
  purchaseDate: string;
  status: AssetStatus;
  assignedTo?: string;
}

export async function createAsset(input: SaveAssetInput): Promise<Asset> {
  const response = await fetch('/api/assets', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(input),
  });

  return parseResponse<Asset>(response);
}

export async function updateAsset(
  id: string,
  input: Partial<SaveAssetInput>,
): Promise<Asset> {
  const response = await fetch(`/api/assets/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(input),
  });

  return parseResponse<Asset>(response);
}
