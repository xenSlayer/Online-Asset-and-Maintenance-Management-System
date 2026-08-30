import type { Technician } from '../types/technician';

export const technicians: Technician[] = [
  {
    id: 'TEC-001',
    name: 'James Okafor',
    specialisation: 'Electrical',
    availability: 'Available',
    activeTasks: 2,
    email: 'james@assetcore.com',
    phone: '+1 555 0201',
    avatarColor: '#4F46E5',
  },
  {
    id: 'TEC-002',
    name: 'Maria Santos',
    specialisation: 'Mechanical',
    availability: 'On Assignment',
    activeTasks: 1,
    email: 'maria@assetcore.com',
    phone: '+1 555 0202',
    avatarColor: '#DB2777',
  },
  {
    id: 'TEC-003',
    name: 'David Chen',
    specialisation: 'HVAC',
    availability: 'Available',
    activeTasks: 0,
    email: 'david@assetcore.com',
    phone: '+1 555 0203',
    avatarColor: '#059669',
  },
  {
    id: 'TEC-004',
    name: 'Priya Nair',
    specialisation: 'IT / Electronics',
    availability: 'On Assignment',
    activeTasks: 3,
    email: 'priya@assetcore.com',
    phone: '+1 555 0204',
    avatarColor: '#7C3AED',
  },
];

export const assignmentTaskPool = [
  { id: 'MR-0041', assetName: 'HVAC Unit 3', status: 'Pending' as const },
  { id: 'MR-0040', assetName: 'Printer B2', status: 'Assigned' as const },
  { id: 'MR-0039', assetName: 'Server Rack A', status: 'In Progress' as const },
];
