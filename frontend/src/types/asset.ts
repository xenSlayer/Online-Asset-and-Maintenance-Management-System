export type AssetCategory =
  | 'Mechanical'
  | 'Electrical'
  | 'IT Equipment'
  | 'Vehicle'
  | 'Office Equipment';

export type AssetStatus =
  | 'Operational'
  | 'Under Maintenance'
  | 'Out of Service'
  | 'Retired';

export interface MaintenanceHistoryItem {
  date: string;
  description: string;
  technician: string;
  cost: string;
}

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  serialNo: string;
  location: string;
  status: AssetStatus;
  assignedTo: string;
  description: string;
  purchaseDate: string;
  maintenanceHistory: MaintenanceHistoryItem[];
}
