import type { MaintenanceRequest } from '../types/maintenanceRequest';

export const maintenanceRequests: MaintenanceRequest[] = [
  {
    id: 'MR-0041',
    assetName: 'HVAC Unit 3',
    assetId: 'AST-001',
    description: 'Compressor making unusual noise',
    priority: 'High',
    date: '28 Jul 2026',
    status: 'Unassigned',
    submittedBy: 'Bob Nkosi',
  },
  {
    id: 'MR-0040',
    assetName: 'Printer B2',
    assetId: 'AST-004',
    description: 'Paper feed jam not resolving',
    priority: 'Medium',
    date: '25 Jul 2026',
    status: 'Assigned',
    submittedBy: 'Eva Osei',
    assignedTechnician: 'James Okafor',
  },
  {
    id: 'MR-0039',
    assetName: 'Server Rack A',
    assetId: 'AST-003',
    description: 'Overheating alert triggered',
    priority: 'High',
    date: '22 Jul 2026',
    status: 'In Progress',
    submittedBy: 'Alice Mensah',
    assignedTechnician: 'James Okafor',
  },
  {
    id: 'MR-0038',
    assetName: 'Forklift #7',
    assetId: 'AST-002',
    description: 'Brake pad worn, requires replacement',
    priority: 'Low',
    date: '18 Jul 2026',
    status: 'Completed',
    submittedBy: 'Bob Nkosi',
    assignedTechnician: 'Maria Santos',
  },
];

export const statusTabs = [
  { key: 'all' as const, label: 'All Requests', count: 4 },
  { key: 'Pending' as const, label: 'Pending', count: 1 },
  { key: 'Assigned' as const, label: 'Assigned', count: 1 },
  { key: 'In Progress' as const, label: 'In Progress', count: 1 },
  { key: 'Completed' as const, label: 'Completed', count: 1 },
];
