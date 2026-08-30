import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const kiranUser = {
  name: 'Kiran Paudel',
  email: 'admin@oamanagement.com',
  password: '123',
  role: 'ADMIN',
  phone: '',
  status: 'Active',
};

const assets = [
  {
    assetName: 'HVAC Unit 3',
    category: 'Mechanical',
    serialNo: 'HV-9302-C',
    description:
      'Commercial split-system HVAC unit serving Building A. Rated 48,000 BTU/h.',
    location: 'Building A – Roof',
    purchaseDate: new Date('2021-03-12'),
    status: 'Under Maintenance',
    assignedTo: 'Facilities',
  },
  {
    assetName: 'Forklift #7',
    category: 'Vehicle',
    serialNo: 'FK-4471-X',
    description:
      'Electric forklift used for warehouse loading and inventory movement.',
    location: 'Warehouse B',
    purchaseDate: new Date('2019-08-04'),
    status: 'Operational',
    assignedTo: 'Warehouse Team',
  },
  {
    assetName: 'Server Rack A',
    category: 'IT Equipment',
    serialNo: 'SR-0011-A',
    description:
      'Primary server rack hosting core infrastructure and application services.',
    location: 'Data Centre',
    purchaseDate: new Date('2020-11-22'),
    status: 'Operational',
    assignedTo: 'IT Dept',
  },
  {
    assetName: 'Printer B2',
    category: 'Office Equipment',
    serialNo: 'PR-8821-B',
    description: 'Multifunction office printer for administrative floor operations.',
    location: 'Floor 2',
    purchaseDate: new Date('2022-02-09'),
    status: 'Operational',
    assignedTo: 'Admin',
  },
  {
    assetName: 'Generator G1',
    category: 'Electrical',
    serialNo: 'GN-5590-G',
    description:
      'Backup diesel generator for Building C. Currently offline pending electrical inspection.',
    location: 'Building C',
    purchaseDate: new Date('2018-06-17'),
    status: 'Out of Service',
    assignedTo: 'Facilities',
  },
  {
    assetName: 'Conference Projector',
    category: 'Office Equipment',
    serialNo: 'PJ-2201-C',
    description: '4K projector for main conference room.',
    location: 'Floor 3',
    purchaseDate: new Date('2023-01-15'),
    status: 'Operational',
    assignedTo: 'Admin',
  },
  {
    assetName: 'Loading Dock Scale',
    category: 'Mechanical',
    serialNo: 'SC-7788-L',
    description: 'Industrial weighing scale at loading dock.',
    location: 'Warehouse A',
    purchaseDate: new Date('2017-09-20'),
    status: 'Retired',
    assignedTo: 'Warehouse Team',
  },
];

async function main() {
  await prisma.maintenanceRecord.deleteMany();
  await prisma.maintenanceRequest.deleteMany();
  await prisma.asset.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash(kiranUser.password, 10);

  const kiran = await prisma.user.create({
    data: {
      name: kiranUser.name,
      email: kiranUser.email,
      password: hashedPassword,
      role: kiranUser.role,
      phone: kiranUser.phone || null,
      status: kiranUser.status,
    },
  });

  const assetMap = new Map<string, number>();

  for (const asset of assets) {
    const record = await prisma.asset.create({ data: asset });
    assetMap.set(asset.assetName, record.id);
  }

  const requests = [
    {
      description: 'Compressor making unusual noise',
      priority: 'High',
      status: 'Pending',
      requestDate: new Date('2026-07-28'),
      userId: kiran.id,
      assetId: assetMap.get('HVAC Unit 3')!,
      assignedTechnicianId: null,
    },
    {
      description: 'Paper feed jam not resolving',
      priority: 'Medium',
      status: 'Assigned',
      requestDate: new Date('2026-07-25'),
      userId: kiran.id,
      assetId: assetMap.get('Printer B2')!,
      assignedTechnicianId: null,
    },
    {
      description: 'Brake pad worn, requires replacement',
      priority: 'Low',
      status: 'Completed',
      requestDate: new Date('2026-07-18'),
      userId: kiran.id,
      assetId: assetMap.get('Forklift #7')!,
      assignedTechnicianId: null,
    },
  ];

  const createdRequests = [];

  for (const request of requests) {
    const record = await prisma.maintenanceRequest.create({ data: request });
    createdRequests.push(record);
  }

  await prisma.maintenanceRecord.create({
    data: {
      requestId: createdRequests[2].id,
      technicianId: kiran.id,
      repairDescription: 'Brake pad replacement and brake fluid top-up',
      repairDate: new Date('2026-07-20'),
      cost: 185.5,
      notes: 'Pads replaced on both rear wheels',
    },
  });

  console.log('Seeded Kiran Paudel and demo data');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
