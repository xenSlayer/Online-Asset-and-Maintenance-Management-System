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

const technicians = [
  {
    name: 'James Okafor',
    email: 'james@assetcore.com',
    password: 'password123',
    role: 'TECHNICIAN',
    specialisation: 'Electrical',
    phone: '+1 555 0201',
    status: 'Active',
  },
  {
    name: 'Maria Santos',
    email: 'maria@assetcore.com',
    password: 'password123',
    role: 'TECHNICIAN',
    specialisation: 'Mechanical',
    phone: '+1 555 0202',
    status: 'Active',
  },
  {
    name: 'David Chen',
    email: 'david@assetcore.com',
    password: 'password123',
    role: 'TECHNICIAN',
    specialisation: 'HVAC',
    phone: '+1 555 0203',
    status: 'Active',
  },
];

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
    assetName: 'Printer B2',
    category: 'Office Equipment',
    serialNo: 'PR-8821-B',
    description: 'Multifunction office printer for administrative floor operations.',
    location: 'Floor 2',
    purchaseDate: new Date('2022-02-09'),
    status: 'Operational',
    assignedTo: 'Admin',
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

  const technicianMap = new Map<string, number>();

  for (const technician of technicians) {
    const record = await prisma.user.create({
      data: {
        name: technician.name,
        email: technician.email,
        password: await bcrypt.hash(technician.password, 10),
        role: technician.role,
        specialisation: technician.specialisation,
        phone: technician.phone,
        status: technician.status,
      },
    });

    technicianMap.set(technician.email, record.id);
  }

  const jamesId = technicianMap.get('james@assetcore.com')!;
  const mariaId = technicianMap.get('maria@assetcore.com')!;

  const assetMap = new Map<string, number>();

  for (const asset of assets) {
    const record = await prisma.asset.create({ data: asset });
    assetMap.set(asset.assetName, record.id);
  }

  const requests = [
    {
      description: 'Compressor making unusual noise',
      priority: 'High',
      status: 'Assigned',
      requestDate: new Date('2026-07-28'),
      userId: kiran.id,
      assetId: assetMap.get('HVAC Unit 3')!,
      assignedTechnicianId: jamesId,
    },
    {
      description: 'Paper feed jam not resolving',
      priority: 'Medium',
      status: 'In Progress',
      requestDate: new Date('2026-07-25'),
      userId: kiran.id,
      assetId: assetMap.get('Printer B2')!,
      assignedTechnicianId: jamesId,
    },
    {
      description: 'Brake pad worn, requires replacement',
      priority: 'Low',
      status: 'Completed',
      requestDate: new Date('2026-07-18'),
      userId: kiran.id,
      assetId: assetMap.get('Forklift #7')!,
      assignedTechnicianId: mariaId,
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
      technicianId: mariaId,
      repairDescription: 'Brake pad replacement and brake fluid top-up',
      repairDate: new Date('2026-07-20'),
      cost: 185.5,
      notes: 'Pads replaced on both rear wheels',
    },
  });

  console.log('Seeded admin, technicians, assets, and maintenance data');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
