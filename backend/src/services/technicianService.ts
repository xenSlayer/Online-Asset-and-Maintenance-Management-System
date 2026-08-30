import bcrypt from 'bcryptjs';
import prisma from '../config/database';

export class TechnicianError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

const AVATAR_COLORS = ['#4F46E5', '#2563EB', '#059669', '#7C3AED', '#DB2777'];
const ACTIVE_STATUSES = ['Assigned', 'In Progress'];

function formatTechnicianId(id: number) {
  return `TEC-${String(id).padStart(3, '0')}`;
}

function formatRequestId(id: number) {
  return `MR-${String(id).padStart(4, '0')}`;
}

function getAvatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

type TechnicianRecord = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  specialisation: string | null;
  status: string;
  assignedRequests: { id: number }[];
};

function formatTechnicianSummary(technician: TechnicianRecord) {
  const activeTasks = technician.assignedRequests.length;

  return {
    id: formatTechnicianId(technician.id),
    name: technician.name,
    specialisation: technician.specialisation ?? 'General Maintenance',
    availability:
      activeTasks > 0 ? ('On Assignment' as const) : ('Available' as const),
    activeTasks,
    email: technician.email,
    phone: technician.phone ?? '',
    status: technician.status,
    avatarColor: getAvatarColor(technician.name),
  };
}

const technicianInclude = {
  assignedRequests: {
    where: {
      status: { in: ACTIVE_STATUSES },
    },
    select: { id: true },
  },
} as const;

export async function listTechnicians() {
  const technicians = await prisma.user.findMany({
    where: { role: 'TECHNICIAN' },
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      specialisation: true,
      status: true,
      assignedRequests: technicianInclude.assignedRequests,
    },
  });

  return technicians.map(formatTechnicianSummary);
}

export async function getTechnicianById(id: number) {
  const technician = await prisma.user.findFirst({
    where: { id, role: 'TECHNICIAN' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      specialisation: true,
      status: true,
      assignedRequests: {
        where: {
          status: { in: ACTIVE_STATUSES },
        },
        orderBy: { requestDate: 'desc' },
        select: {
          id: true,
          status: true,
          asset: { select: { assetName: true } },
        },
      },
    },
  });

  if (!technician) {
    throw new TechnicianError('Technician not found', 404);
  }

  const summary = formatTechnicianSummary({
    ...technician,
    assignedRequests: technician.assignedRequests.map((request) => ({
      id: request.id,
    })),
  });

  return {
    ...summary,
    tasks: technician.assignedRequests.map((request) => ({
      id: formatRequestId(request.id),
      assetName: request.asset.assetName,
      status: request.status,
    })),
  };
}

export function parseTechnicianId(id: string) {
  const numericId = Number(id.replace(/^TEC-/, ''));

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new TechnicianError('Invalid technician ID', 400);
  }

  return numericId;
}

interface UpdateTechnicianInput {
  name?: string;
  email?: string;
  phone?: string;
  specialisation?: string;
  status?: string;
  password?: string;
}

export async function updateTechnician(id: number, input: UpdateTechnicianInput) {
  const existing = await prisma.user.findFirst({
    where: { id, role: 'TECHNICIAN' },
  });

  if (!existing) {
    throw new TechnicianError('Technician not found', 404);
  }

  const email = input.email?.toLowerCase().trim();

  if (email && email !== existing.email) {
    const duplicate = await prisma.user.findUnique({ where: { email } });

    if (duplicate) {
      throw new TechnicianError('A user with this email already exists', 409);
    }
  }

  const data: {
    name?: string;
    email?: string;
    phone?: string | null;
    specialisation?: string | null;
    status?: string;
    password?: string;
  } = {};

  if (input.name !== undefined) data.name = input.name.trim();
  if (email !== undefined) data.email = email;
  if (input.phone !== undefined) data.phone = input.phone.trim() || null;
  if (input.specialisation !== undefined) {
    data.specialisation = input.specialisation.trim() || null;
  }
  if (input.status !== undefined) data.status = input.status;

  if (input.password) {
    data.password = await bcrypt.hash(input.password, 10);
  }

  const technician = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      specialisation: true,
      status: true,
      assignedRequests: technicianInclude.assignedRequests,
    },
  });

  return getTechnicianById(technician.id);
}
