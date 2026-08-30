import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const users = [
  {
    name: 'System Admin',
    email: 'admin@oamanagement.com',
    password: '123',
    role: 'ADMIN',
  },
  {
    name: 'Alice Mensah',
    email: 'alice@assetcore.com',
    password: 'password123',
    role: 'ADMIN',
  },
  {
    name: 'Bob Nkosi',
    email: 'bob@assetcore.com',
    password: 'password123',
    role: 'STAFF',
  },
  {
    name: 'James Okafor',
    email: 'james@assetcore.com',
    password: 'password123',
    role: 'TECHNICIAN',
    specialisation: 'Electrical',
  },
  {
    name: 'Eva Osei',
    email: 'eva@assetcore.com',
    password: 'password123',
    role: 'STAFF',
  },
  {
    name: 'Maria Santos',
    email: 'maria@assetcore.com',
    password: 'password123',
    role: 'TECHNICIAN',
    specialisation: 'Mechanical',
  },
  {
    name: 'David Chen',
    email: 'david@assetcore.com',
    password: 'password123',
    role: 'TECHNICIAN',
    specialisation: 'HVAC',
  },
  {
    name: 'Priya Nair',
    email: 'priya@assetcore.com',
    password: 'password123',
    role: 'TECHNICIAN',
    specialisation: 'IT / Electronics',
  },
];

const assets = [
  {
    assetName: 'HVAC Unit 3',
    category: 'Mechanical',
    description:
      'Commercial split-system HVAC unit serving Building A. Rated 48,000 BTU/h.',
    location: 'Building A – Roof',
    purchaseDate: new Date('2021-03-12'),
    status: 'Under Maintenance',
  },
  {
    assetName: 'Forklift #7',
    category: 'Vehicle',
    description:
      'Electric forklift used for warehouse loading and inventory movement.',
    location: 'Warehouse B',
    purchaseDate: new Date('2019-08-04'),
    status: 'Operational',
  },
  {
    assetName: 'Server Rack A',
    category: 'IT Equipment',
    description:
      'Primary server rack hosting core infrastructure and application services.',
    location: 'Data Centre',
    purchaseDate: new Date('2020-11-22'),
    status: 'Operational',
  },
  {
    assetName: 'Printer B2',
    category: 'Office Equipment',
    description: 'Multifunction office printer for administrative floor operations.',
    location: 'Floor 2',
    purchaseDate: new Date('2022-02-09'),
    status: 'Operational',
  },
  {
    assetName: 'Generator G1',
    category: 'Electrical',
    description:
      'Backup diesel generator for Building C. Currently offline pending electrical inspection.',
    location: 'Building C',
    purchaseDate: new Date('2018-06-17'),
    status: 'Out of Service',
  },
  {
    assetName: 'Conference Projector',
    category: 'Office Equipment',
    description: '4K projector for main conference room.',
    location: 'Floor 3',
    purchaseDate: new Date('2023-01-15'),
    status: 'Operational',
  },
  {
    assetName: 'Loading Dock Scale',
    category: 'Mechanical',
    description: 'Industrial weighing scale at loading dock.',
    location: 'Warehouse A',
    purchaseDate: new Date('2017-09-20'),
    status: 'Retired',
  },
];

async function main() {
  const userMap = new Map<string, number>();

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const record = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        password: hashedPassword,
        role: user.role,
        specialisation: user.specialisation ?? null,
      },
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        specialisation: user.specialisation ?? null,
      },
    });

    userMap.set(user.email, record.id);
  }

  const assetMap = new Map<string, number>();

  await prisma.maintenanceRecord.deleteMany();
  await prisma.maintenanceRequest.deleteMany();
  await prisma.asset.deleteMany();

  for (const asset of assets) {
    const record = await prisma.asset.create({ data: asset });
    assetMap.set(asset.assetName, record.id);
  }

  const bobId = userMap.get('bob@assetcore.com')!;
  const evaId = userMap.get('eva@assetcore.com')!;
  const aliceId = userMap.get('alice@assetcore.com')!;
  const jamesId = userMap.get('james@assetcore.com')!;
  const mariaId = userMap.get('maria@assetcore.com')!;

  const requests = [
    {
      description: 'Compressor making unusual noise',
      priority: 'High',
      status: 'Pending',
      requestDate: new Date('2026-07-28'),
      userId: bobId,
      assetId: assetMap.get('HVAC Unit 3')!,
      assignedTechnicianId: null,
    },
    {
      description: 'Paper feed jam not resolving',
      priority: 'Medium',
      status: 'Assigned',
      requestDate: new Date('2026-07-25'),
      userId: evaId,
      assetId: assetMap.get('Printer B2')!,
      assignedTechnicianId: jamesId,
    },
    {
      description: 'Overheating alert triggered',
      priority: 'High',
      status: 'In Progress',
      requestDate: new Date('2026-07-22'),
      userId: aliceId,
      assetId: assetMap.get('Server Rack A')!,
      assignedTechnicianId: jamesId,
    },
    {
      description: 'Brake pad worn, requires replacement',
      priority: 'Low',
      status: 'Completed',
      requestDate: new Date('2026-07-18'),
      userId: bobId,
      assetId: assetMap.get('Forklift #7')!,
      assignedTechnicianId: mariaId,
    },
    {
      description: 'Annual safety inspection',
      priority: 'Medium',
      status: 'Completed',
      requestDate: new Date('2026-06-15'),
      userId: evaId,
      assetId: assetMap.get('Conference Projector')!,
      assignedTechnicianId: mariaId,
    },
    {
      description: 'Cooling fan replacement',
      priority: 'High',
      status: 'Completed',
      requestDate: new Date('2026-04-18'),
      userId: aliceId,
      assetId: assetMap.get('Server Rack A')!,
      assignedTechnicianId: userMap.get('priya@assetcore.com')!,
    },
    {
      description: 'Hydraulic system inspection',
      priority: 'Low',
      status: 'Completed',
      requestDate: new Date('2026-05-10'),
      userId: bobId,
      assetId: assetMap.get('Forklift #7')!,
      assignedTechnicianId: mariaId,
    },
    {
      description: 'Engine diagnostic and fault assessment',
      priority: 'Critical',
      status: 'Pending',
      requestDate: new Date('2026-01-12'),
      userId: aliceId,
      assetId: assetMap.get('Generator G1')!,
      assignedTechnicianId: null,
    },
    {
      description: 'Filter replacement scheduled',
      priority: 'Medium',
      status: 'Completed',
      requestDate: new Date('2026-02-19'),
      userId: evaId,
      assetId: assetMap.get('HVAC Unit 3')!,
      assignedTechnicianId: userMap.get('david@assetcore.com')!,
    },
    {
      description: 'Toner cartridge and roller service',
      priority: 'Low',
      status: 'Completed',
      requestDate: new Date('2026-03-01'),
      userId: bobId,
      assetId: assetMap.get('Printer B2')!,
      assignedTechnicianId: userMap.get('david@assetcore.com')!,
    },
    {
      description: 'Routine belt tension check',
      priority: 'Medium',
      status: 'Completed',
      requestDate: new Date('2026-01-08'),
      userId: evaId,
      assetId: assetMap.get('Forklift #7')!,
      assignedTechnicianId: mariaId,
    },
  ];

  const createdRequests = [];

  for (const request of requests) {
    const record = await prisma.maintenanceRequest.create({ data: request });
    createdRequests.push(record);
  }

  const completedRecords = [
    {
      requestId: createdRequests[3].id,
      technicianId: mariaId,
      repairDescription: 'Brake pad replacement and brake fluid top-up',
      repairDate: new Date('2026-07-20'),
      cost: 185.5,
      notes: 'Pads replaced on both rear wheels',
    },
    {
      requestId: createdRequests[4].id,
      technicianId: mariaId,
      repairDescription: 'Annual safety inspection completed',
      repairDate: new Date('2026-06-17'),
      cost: 95,
    },
    {
      requestId: createdRequests[5].id,
      technicianId: userMap.get('priya@assetcore.com')!,
      repairDescription: 'Cooling fan replaced in rack unit 3',
      repairDate: new Date('2026-04-20'),
      cost: 85,
    },
    {
      requestId: createdRequests[6].id,
      technicianId: mariaId,
      repairDescription: 'Hydraulic system inspected and serviced',
      repairDate: new Date('2026-05-12'),
      cost: 120,
    },
    {
      requestId: createdRequests[8].id,
      technicianId: userMap.get('david@assetcore.com')!,
      repairDescription: 'HVAC filters replaced',
      repairDate: new Date('2026-02-21'),
      cost: 75,
    },
    {
      requestId: createdRequests[9].id,
      technicianId: userMap.get('david@assetcore.com')!,
      repairDescription: 'Toner cartridge and roller service',
      repairDate: new Date('2026-03-03'),
      cost: 45,
    },
    {
      requestId: createdRequests[10].id,
      technicianId: mariaId,
      repairDescription: 'Belt tension adjusted to specification',
      repairDate: new Date('2026-01-10'),
      cost: 60,
    },
  ];

  for (const record of completedRecords) {
    await prisma.maintenanceRecord.create({ data: record });
  }

  console.log('Seeded users, assets, maintenance requests, and records');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
