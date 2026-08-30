import prisma from '../config/database';
import { Prisma } from '@prisma/client';
import type { AuthPayload } from '../middleware/authMiddleware';
import {
  formatAssetId,
  formatDisplayDate,
  formatIsoDate,
  formatRequestId,
  formatTechnicianId,
  parseAssetId,
  parseRequestId,
  parseTechnicianUserId,
} from '../utils/formatters';

export class MaintenanceRequestError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

const requestInclude = {
  asset: { select: { id: true, assetName: true } },
  user: { select: { id: true, name: true } },
  assignedTechnician: { select: { id: true, name: true } },
} as const;

function resolveStatus(status: string, assignedTechnicianId: number | null) {
  if (!assignedTechnicianId) {
    return 'Unassigned';
  }

  if (status === 'In Progress') {
    return 'In Progress';
  }

  return 'Assigned';
}

function formatRequest(request: {
  id: number;
  description: string;
  priority: string;
  status: string;
  requestDate: Date;
  asset: { id: number; assetName: string };
  user: { name: string };
  assignedTechnician: { id: number; name: string } | null;
  assignedTechnicianId?: number | null;
}) {
  const technicianId =
    request.assignedTechnician?.id ?? request.assignedTechnicianId ?? null;

  return {
    id: formatRequestId(request.id),
    assetName: request.asset.assetName,
    assetId: formatAssetId(request.asset.id),
    description: request.description,
    priority: request.priority,
    date: formatDisplayDate(request.requestDate),
    isoDate: formatIsoDate(request.requestDate),
    status: resolveStatus(request.status, technicianId),
    submittedBy: request.user.name,
    assignedTechnician: request.assignedTechnician?.name,
    assignedTechnicianId: request.assignedTechnician
      ? formatTechnicianId(request.assignedTechnician.id)
      : undefined,
  };
}

function getRoleFilter(auth: AuthPayload) {
  if (auth.role === 'ADMIN') {
    return {};
  }

  if (auth.role === 'STAFF') {
    return { userId: auth.userId };
  }

  if (auth.role === 'TECHNICIAN') {
    return { assignedTechnicianId: auth.userId };
  }

  return { userId: -1 };
}

function canManageRequestWork(
  auth: AuthPayload,
  assignedTechnicianId: number | null,
) {
  return (
    auth.role === 'TECHNICIAN' && assignedTechnicianId === auth.userId
  );
}

export async function listMaintenanceRequests(auth: AuthPayload) {
  const requests = await prisma.maintenanceRequest.findMany({
    where: {
      ...getRoleFilter(auth),
      status: { not: 'Completed' },
    },
    orderBy: { requestDate: 'desc' },
    include: requestInclude,
  });

  return requests.map(formatRequest);
}

interface CreateRequestInput {
  assetId: string;
  description: string;
  priority: string;
  requestDate?: string;
}

export async function createMaintenanceRequest(
  auth: AuthPayload,
  input: CreateRequestInput,
) {
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { id: true },
  });

  if (!user) {
    throw new MaintenanceRequestError(
      'Your session is invalid. Please log in again.',
      401,
    );
  }

  let assetId: number;

  try {
    assetId = parseAssetId(input.assetId);
  } catch {
    throw new MaintenanceRequestError('Invalid asset ID', 400);
  }

  const asset = await prisma.asset.findUnique({ where: { id: assetId } });

  if (!asset) {
    throw new MaintenanceRequestError('Asset not found', 404);
  }

  const request = await prisma.maintenanceRequest.create({
    data: {
      description: input.description.trim(),
      priority: input.priority,
      status: 'Pending',
      requestDate: input.requestDate
        ? new Date(input.requestDate)
        : new Date(),
      userId: auth.userId,
      assetId,
    },
    include: requestInclude,
  });

  return formatRequest(request);
}

function isPrismaForeignKeyError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2003'
  );
}

export { isPrismaForeignKeyError };

export async function approveMaintenanceRequest(
  id: number,
  auth: AuthPayload,
) {
  if (auth.role !== 'ADMIN') {
    throw new MaintenanceRequestError('Only administrators can approve requests', 403);
  }

  const existing = await prisma.maintenanceRequest.findUnique({ where: { id } });

  if (!existing) {
    throw new MaintenanceRequestError('Request not found', 404);
  }

  if (existing.status !== 'Pending') {
    throw new MaintenanceRequestError('Only pending requests can be approved', 400);
  }

  const request = await prisma.maintenanceRequest.update({
    where: { id },
    data: { status: 'Pending' },
    include: requestInclude,
  });

  return formatRequest(request);
}

export async function assignMaintenanceRequest(
  id: number,
  technicianId: string | null | undefined,
  auth: AuthPayload,
) {
  if (auth.role !== 'ADMIN') {
    throw new MaintenanceRequestError('Only administrators can assign requests', 403);
  }

  const existing = await prisma.maintenanceRequest.findUnique({ where: { id } });

  if (!existing) {
    throw new MaintenanceRequestError('Request not found', 404);
  }

  if (!['Pending', 'Assigned', 'In Progress'].includes(existing.status)) {
    throw new MaintenanceRequestError(
      'Only pending, assigned, or in-progress requests can be reassigned',
      400,
    );
  }

  const normalizedTechnicianId = technicianId?.trim() || null;

  if (!normalizedTechnicianId) {
    await prisma.$transaction(async (tx) => {
      await tx.maintenanceRequest.update({
        where: { id },
        data: {
          assignedTechnicianId: null,
          status: 'Pending',
        },
      });

      if (existing.status === 'In Progress') {
        await tx.asset.update({
          where: { id: existing.assetId },
          data: { status: 'Operational' },
        });
      }
    });

    const request = await prisma.maintenanceRequest.findUniqueOrThrow({
      where: { id },
      include: requestInclude,
    });

    return formatRequest(request);
  }

  const technicianUserId = parseTechnicianUserId(normalizedTechnicianId);

  const technician = await prisma.user.findFirst({
    where: { id: technicianUserId, role: 'TECHNICIAN' },
  });

  if (!technician) {
    throw new MaintenanceRequestError('Technician not found', 404);
  }

  const request = await prisma.maintenanceRequest.update({
    where: { id },
    data: {
      assignedTechnicianId: technicianUserId,
      status:
        existing.status === 'In Progress' ? 'In Progress' : 'Assigned',
    },
    include: requestInclude,
  });

  return formatRequest(request);
}

export async function deleteMaintenanceRequest(id: number, auth: AuthPayload) {
  if (auth.role !== 'ADMIN') {
    throw new MaintenanceRequestError('Only administrators can reject requests', 403);
  }

  const existing = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: { maintenanceRecord: true },
  });

  if (!existing) {
    throw new MaintenanceRequestError('Request not found', 404);
  }

  if (existing.assignedTechnicianId) {
    throw new MaintenanceRequestError(
      'Only unassigned requests can be rejected',
      400,
    );
  }

  if (existing.status === 'Completed') {
    throw new MaintenanceRequestError('Completed requests cannot be rejected', 400);
  }

  if (existing.maintenanceRecord) {
    throw new MaintenanceRequestError(
      'Cannot reject a request that has a maintenance record',
      409,
    );
  }

  await prisma.maintenanceRequest.delete({ where: { id } });

  return { id: formatRequestId(id) };
}

export async function updateMaintenanceRequestProgress(
  id: number,
  auth: AuthPayload,
) {
  const existing = await prisma.maintenanceRequest.findUnique({ where: { id } });

  if (!existing) {
    throw new MaintenanceRequestError('Request not found', 404);
  }

  if (!canManageRequestWork(auth, existing.assignedTechnicianId)) {
    throw new MaintenanceRequestError(
      'Only the assigned technician can start this request',
      403,
    );
  }

  if (!existing.assignedTechnicianId) {
    throw new MaintenanceRequestError(
      'Request must be assigned to a technician before work can start',
      400,
    );
  }

  if (existing.status !== 'Assigned') {
    throw new MaintenanceRequestError(
      'Only assigned requests can be moved to in progress',
      400,
    );
  }

  await prisma.$transaction(async (tx) => {
    await tx.maintenanceRequest.update({
      where: { id },
      data: { status: 'In Progress' },
    });

    await tx.asset.update({
      where: { id: existing.assetId },
      data: { status: 'Under Maintenance' },
    });
  });

  const request = await prisma.maintenanceRequest.findUniqueOrThrow({
    where: { id },
    include: requestInclude,
  });

  return formatRequest(request);
}

interface CompleteRequestInput {
  cost?: number;
  partsReplaced?: string;
  repairDescription?: string;
}

export async function completeMaintenanceRequest(
  id: number,
  auth: AuthPayload,
  input: CompleteRequestInput = {},
) {
  const existing = await prisma.maintenanceRequest.findUnique({
    where: { id },
    include: { maintenanceRecord: true },
  });

  if (!existing) {
    throw new MaintenanceRequestError('Request not found', 404);
  }

  if (!canManageRequestWork(auth, existing.assignedTechnicianId)) {
    throw new MaintenanceRequestError(
      'Only the assigned technician can complete this request',
      403,
    );
  }

  if (!existing.assignedTechnicianId) {
    throw new MaintenanceRequestError(
      'Request must be assigned to a technician before it can be completed',
      400,
    );
  }

  if (existing.status !== 'In Progress') {
    throw new MaintenanceRequestError(
      'Only in-progress requests can be completed',
      400,
    );
  }

  if (existing.maintenanceRecord) {
    throw new MaintenanceRequestError('Request is already completed', 409);
  }

  const technicianId = existing.assignedTechnicianId;

  await prisma.$transaction(async (tx) => {
    await tx.maintenanceRequest.update({
      where: { id },
      data: { status: 'Completed' },
    });

    await tx.maintenanceRecord.create({
      data: {
        requestId: id,
        technicianId,
        repairDescription:
          input.repairDescription?.trim() || existing.description,
        repairDate: new Date(),
        cost: input.cost ?? 0,
        notes: input.partsReplaced?.trim() || null,
      },
    });

    await tx.asset.update({
      where: { id: existing.assetId },
      data: { status: 'Operational' },
    });
  });

  const request = await prisma.maintenanceRequest.findUniqueOrThrow({
    where: { id },
    include: requestInclude,
  });

  return formatRequest(request);
}

export { parseRequestId };
