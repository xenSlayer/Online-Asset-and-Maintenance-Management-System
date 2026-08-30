import prisma from '../config/database';

export class AssetError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

function formatAssetId(id: number) {
  return `AST-${String(id).padStart(3, '0')}`;
}

function formatPurchaseDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatDisplayDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatCost(cost: { toString(): string }) {
  return `$${Number(cost).toFixed(0)}`;
}

type AssetRecord = {
  id: number;
  assetName: string;
  category: string;
  serialNo: string | null;
  description: string | null;
  location: string;
  purchaseDate: Date;
  status: string;
  assignedTo: string | null;
};

function formatAssetSummary(asset: AssetRecord) {
  return {
    id: formatAssetId(asset.id),
    name: asset.assetName,
    category: asset.category,
    serialNo: asset.serialNo ?? '',
    location: asset.location,
    status: asset.status,
    assignedTo: asset.assignedTo ?? 'Unassigned',
    description: asset.description ?? '',
    purchaseDate: formatPurchaseDate(asset.purchaseDate),
    maintenanceHistory: [] as {
      date: string;
      description: string;
      technician: string;
      cost: string;
    }[],
  };
}

async function getMaintenanceHistory(assetId: number) {
  const records = await prisma.maintenanceRecord.findMany({
    where: {
      request: { assetId },
    },
    orderBy: { repairDate: 'desc' },
    include: {
      technician: { select: { name: true } },
    },
  });

  return records.map((record) => ({
    date: formatDisplayDate(record.repairDate),
    description: record.repairDescription,
    technician: record.technician.name,
    cost: formatCost(record.cost),
  }));
}

export async function listAssets() {
  const assets = await prisma.asset.findMany({
    orderBy: { id: 'asc' },
  });

  return assets.map(formatAssetSummary);
}

export async function getAssetById(id: number) {
  const asset = await prisma.asset.findUnique({ where: { id } });

  if (!asset) {
    throw new AssetError('Asset not found', 404);
  }

  const maintenanceHistory = await getMaintenanceHistory(id);

  return {
    ...formatAssetSummary(asset),
    maintenanceHistory,
  };
}

interface SaveAssetInput {
  name: string;
  category: string;
  serialNo?: string;
  description?: string;
  location: string;
  purchaseDate: string;
  status: string;
  assignedTo?: string;
}

function parsePurchaseDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AssetError('Invalid purchase date');
  }

  return date;
}

export async function createAsset(input: SaveAssetInput) {
  const asset = await prisma.asset.create({
    data: {
      assetName: input.name.trim(),
      category: input.category,
      serialNo: input.serialNo?.trim() || null,
      description: input.description?.trim() || null,
      location: input.location.trim(),
      purchaseDate: parsePurchaseDate(input.purchaseDate),
      status: input.status,
      assignedTo:
        input.assignedTo && input.assignedTo !== 'Unassigned'
          ? input.assignedTo
          : null,
    },
  });

  return formatAssetSummary(asset);
}

export async function updateAsset(id: number, input: Partial<SaveAssetInput>) {
  const existing = await prisma.asset.findUnique({ where: { id } });

  if (!existing) {
    throw new AssetError('Asset not found', 404);
  }

  const asset = await prisma.asset.update({
    where: { id },
    data: {
      ...(input.name !== undefined && { assetName: input.name.trim() }),
      ...(input.category !== undefined && { category: input.category }),
      ...(input.serialNo !== undefined && {
        serialNo: input.serialNo.trim() || null,
      }),
      ...(input.description !== undefined && {
        description: input.description.trim() || null,
      }),
      ...(input.location !== undefined && { location: input.location.trim() }),
      ...(input.purchaseDate !== undefined && {
        purchaseDate: parsePurchaseDate(input.purchaseDate),
      }),
      ...(input.status !== undefined && { status: input.status }),
      ...(input.assignedTo !== undefined && {
        assignedTo:
          input.assignedTo && input.assignedTo !== 'Unassigned'
            ? input.assignedTo
            : null,
      }),
    },
  });

  return formatAssetSummary(asset);
}

export function parseAssetId(id: string) {
  const numericId = Number(id.replace(/^AST-/, ''));

  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new AssetError('Invalid asset ID', 400);
  }

  return numericId;
}
