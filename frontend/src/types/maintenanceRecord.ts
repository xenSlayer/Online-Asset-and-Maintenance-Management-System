import type { AssetCategory } from './asset';

export interface MaintenanceRecord {
  id: string;
  requestId: string;
  assetName: string;
  assetCategory: AssetCategory;
  technician: string;
  technicianColor: string;
  description: string;
  partsReplaced: string;
  date: string;
  isoDate: string;
  cost: number;
  costDisplay: string;
}
