import type { User } from '../types/user';

export const users: User[] = [
  {
    id: 'U-001',
    name: 'Alice Mensah',
    email: 'alice@assetcore.com',
    phone: '+1 555 0101',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 'U-002',
    name: 'Bob Nkosi',
    email: 'bob@assetcore.com',
    phone: '+1 555 0102',
    role: 'Staff',
    status: 'Active',
  },
  {
    id: 'U-003',
    name: 'Carla Reyes',
    email: 'carla@assetcore.com',
    phone: '+1 555 0103',
    role: 'Technician',
    status: 'Active',
  },
  {
    id: 'U-004',
    name: 'David Huang',
    email: 'david@assetcore.com',
    phone: '+1 555 0104',
    role: 'Staff',
    status: 'Inactive',
  },
  {
    id: 'U-005',
    name: 'Eva Osei',
    email: 'eva@assetcore.com',
    phone: '+1 555 0105',
    role: 'Technician',
    status: 'Active',
  },
];
