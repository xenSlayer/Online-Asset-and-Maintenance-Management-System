export type RequestPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type RequestStatus =
  | 'Unassigned'
  | 'Assigned'
  | 'In Progress'
  | 'Completed';

export type StatusTab = 'all' | 'unassigned' | 'Assigned' | 'In Progress';

export interface MaintenanceRequest {
  id: string;
  assetName: string;
  assetId: string;
  description: string;
  priority: RequestPriority;
  date: string;
  status: RequestStatus;
  submittedBy: string;
  assignedTechnician?: string;
  assignedTechnicianId?: string;
}
