import type { Asset } from '../types/asset';

export const assets: Asset[] = [
  {
    id: 'AST-001',
    name: 'HVAC Unit 3',
    category: 'Mechanical',
    serialNo: 'HV-9302-C',
    location: 'Building A – Roof',
    status: 'Under Maintenance',
    assignedTo: 'Facilities',
    purchaseDate: '12 Mar 2021',
    description:
      'Commercial split-system HVAC unit serving Building A. Rated 48,000 BTU/h. Last serviced 8 months ago. Currently flagged for compressor inspection following noise complaint from occupants.',
    maintenanceHistory: [
      {
        date: '15 Jun 2026',
        description: 'Compressor belt replacement',
        technician: 'James Okafor',
        cost: '$240',
      },
      {
        date: '02 Jan 2026',
        description: 'Annual servicing & filter change',
        technician: 'Maria Santos',
        cost: '$180',
      },
      {
        date: '30 Jul 2025',
        description: 'Refrigerant top-up',
        technician: 'David Chen',
        cost: '$95',
      },
    ],
  },
  {
    id: 'AST-002',
    name: 'Forklift #7',
    category: 'Vehicle',
    serialNo: 'FK-4471-X',
    location: 'Warehouse B',
    status: 'Operational',
    assignedTo: 'Warehouse Team',
    purchaseDate: '04 Aug 2019',
    description:
      'Electric forklift used for warehouse loading and inventory movement. Rated 2,500 kg capacity.',
    maintenanceHistory: [
      {
        date: '10 May 2026',
        description: 'Hydraulic system inspection',
        technician: 'Maria Santos',
        cost: '$120',
      },
    ],
  },
  {
    id: 'AST-003',
    name: 'Server Rack A',
    category: 'IT Equipment',
    serialNo: 'SR-0011-A',
    location: 'Data Centre',
    status: 'Operational',
    assignedTo: 'IT Dept',
    purchaseDate: '22 Nov 2020',
    description:
      'Primary server rack hosting core infrastructure and application services.',
    maintenanceHistory: [
      {
        date: '18 Apr 2026',
        description: 'Cooling fan replacement',
        technician: 'Priya Nair',
        cost: '$85',
      },
    ],
  },
  {
    id: 'AST-004',
    name: 'Printer B2',
    category: 'Office Equipment',
    serialNo: 'PR-8821-B',
    location: 'Floor 2',
    status: 'Operational',
    assignedTo: 'Admin',
    purchaseDate: '09 Feb 2022',
    description:
      'Multifunction office printer for administrative floor operations.',
    maintenanceHistory: [
      {
        date: '01 Mar 2026',
        description: 'Toner cartridge and roller service',
        technician: 'David Chen',
        cost: '$45',
      },
    ],
  },
  {
    id: 'AST-005',
    name: 'Generator G1',
    category: 'Electrical',
    serialNo: 'GN-5590-G',
    location: 'Building C',
    status: 'Out of Service',
    assignedTo: 'Facilities',
    purchaseDate: '17 Jun 2018',
    description:
      'Backup diesel generator for Building C. Currently offline pending electrical inspection.',
    maintenanceHistory: [
      {
        date: '12 Dec 2025',
        description: 'Engine diagnostic and fault assessment',
        technician: 'James Okafor',
        cost: '$310',
      },
    ],
  },
];
