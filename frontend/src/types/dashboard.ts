export interface DashboardSummary {
  totalUsers: number;
  totalAssets: number;
  pendingRequests: number;
  highPriorityPending: number;
  completedTasks: number;
  availableTechnicians: number;
  techniciansOnAssignment: number;
  completedThisQuarter: number;
}

export interface DashboardMonthPoint {
  month: string;
  value: number;
}

export interface DashboardAssetSegment {
  label: string;
  value: number;
  color: string;
}

export interface DashboardRecentRequest {
  id: string;
  asset: string;
  priority: string;
  status: string;
  submittedBy: string;
}

export interface DashboardTechnician {
  name: string;
  specialisation: string;
  availability: 'Available' | 'On Assignment';
}

export interface DashboardData {
  summary: DashboardSummary;
  maintenanceByMonth: DashboardMonthPoint[];
  maintenanceTotal: number;
  maintenancePeriodLabel: string;
  assetStatusBreakdown: DashboardAssetSegment[];
  recentRequests: DashboardRecentRequest[];
  technicians: DashboardTechnician[];
}
