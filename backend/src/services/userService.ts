import bcrypt from 'bcryptjs';
import prisma from '../config/database';
import { toDatabaseRole, toFrontendRole } from '../utils/role';

export class UserError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

function formatUserId(id: number) {
  return `U-${String(id).padStart(3, '0')}`;
}

function formatUser(user: {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  status: string;
}) {
  return {
    id: formatUserId(user.id),
    name: user.name,
    email: user.email,
    phone: user.phone ?? '',
    role: toFrontendRole(user.role),
    status: user.status,
  };
}

export async function listUsers() {
  const users = await prisma.user.findMany({
    orderBy: { id: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
    },
  });

  return users.map(formatUser);
}

interface CreateUserInput {
  name: string;
  email: string;
  phone?: string;
  role: string;
  status?: string;
  password: string;
  specialisation?: string;
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
  password?: string;
  specialisation?: string;
}

export async function createUser(input: CreateUserInput) {
  const email = input.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    throw new UserError('A user with this email already exists', 409);
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);
  const dbRole = toDatabaseRole(input.role);

  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email,
      phone: input.phone?.trim() || null,
      role: dbRole,
      status: input.status ?? 'Active',
      password: hashedPassword,
      specialisation:
        dbRole === 'TECHNICIAN' ? input.specialisation?.trim() || null : null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
    },
  });

  return formatUser(user);
}

export async function updateUser(id: number, input: UpdateUserInput) {
  const existing = await prisma.user.findUnique({ where: { id } });

  if (!existing) {
    throw new UserError('User not found', 404);
  }

  const email = input.email?.toLowerCase().trim();

  if (email && email !== existing.email) {
    const duplicate = await prisma.user.findUnique({ where: { email } });

    if (duplicate) {
      throw new UserError('A user with this email already exists', 409);
    }
  }

  const dbRole = input.role ? toDatabaseRole(input.role) : undefined;
  const data: {
    name?: string;
    email?: string;
    phone?: string | null;
    role?: string;
    status?: string;
    password?: string;
    specialisation?: string | null;
  } = {};

  if (input.name !== undefined) data.name = input.name.trim();
  if (email !== undefined) data.email = email;
  if (input.phone !== undefined) data.phone = input.phone.trim() || null;
  if (dbRole !== undefined) data.role = dbRole;
  if (input.status !== undefined) data.status = input.status;

  if (input.password) {
    data.password = await bcrypt.hash(input.password, 10);
  }

  if (dbRole !== undefined) {
    data.specialisation =
      dbRole === 'TECHNICIAN' ? input.specialisation?.trim() || null : null;
  } else if (input.specialisation !== undefined && existing.role === 'TECHNICIAN') {
    data.specialisation = input.specialisation.trim() || null;
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      status: true,
    },
  });

  return formatUser(user);
}

export async function deleteUser(id: number) {
  const existing = await prisma.user.findUnique({ where: { id } });

  if (!existing) {
    throw new UserError('User not found', 404);
  }

  const [activeAssignments, maintenanceRecords, submittedRequests] =
    await Promise.all([
      prisma.maintenanceRequest.count({
        where: {
          assignedTechnicianId: id,
          status: { in: ['Assigned', 'In Progress', 'Pending'] },
        },
      }),
      prisma.maintenanceRecord.count({
        where: { technicianId: id },
      }),
      prisma.maintenanceRequest.count({
        where: { userId: id },
      }),
    ]);

  if (activeAssignments > 0) {
    throw new UserError(
      `Cannot delete user. This technician has ${activeAssignments} active maintenance assignment(s). Reassign or complete them first.`,
      409,
    );
  }

  if (maintenanceRecords > 0) {
    throw new UserError(
      'Cannot delete user. This technician has maintenance records linked to their account.',
      409,
    );
  }

  if (submittedRequests > 0) {
    throw new UserError(
      `Cannot delete user. This user has ${submittedRequests} submitted maintenance request(s).`,
      409,
    );
  }

  await prisma.user.delete({ where: { id } });

  return { id: formatUserId(id) };
}

export function parseUserId(id: string) {
  const numericId = Number(id.replace(/^U-/, ''));

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new UserError('Invalid user ID', 400);
  }

  return numericId;
}
