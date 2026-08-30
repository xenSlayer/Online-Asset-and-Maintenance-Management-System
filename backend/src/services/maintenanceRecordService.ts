import prisma from '../config/database';
import {
  formatDisplayDate,
  formatIsoDate,
  formatRecordId,
  formatRequestId,
  getAvatarColor,
} from '../utils/formatters';

export class MaintenanceRecordError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

function formatRecord(record: {
  id: number;
  repairDescription: string;
  repairDate: Date;
  cost: { toString(): string };
  notes: string | null;
  technician: { name: string };
  request: {
    id: number;
    asset: { assetName: string; category: string };
  };
}) {
  const cost = Number(record.cost);

  return {
    id: formatRecordId(record.id),
    requestId: formatRequestId(record.request.id),
    assetName: record.request.asset.assetName,
    assetCategory: record.request.asset.category,
    technician: record.technician.name,
    technicianColor: getAvatarColor(record.technician.name),
    description: record.repairDescription,
    partsReplaced: record.notes ?? '—',
    date: formatDisplayDate(record.repairDate),
    isoDate: formatIsoDate(record.repairDate),
    cost,
    costDisplay: `$${cost.toFixed(0)}`,
  };
}

export async function listMaintenanceRecords() {
  const records = await prisma.maintenanceRecord.findMany({
    orderBy: { repairDate: 'desc' },
    include: {
      technician: { select: { name: true } },
      request: {
        select: {
          id: true,
          asset: { select: { assetName: true, category: true } },
        },
      },
    },
  });

  const formattedRecords = records.map(formatRecord);

  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const recordsThisYear = formattedRecords.filter(
    (record) => record.isoDate >= formatIsoDate(yearStart),
  );

  const totalCostYtd = recordsThisYear.reduce(
    (sum, record) => sum + record.cost,
    0,
  );

  const summary = {
    totalRecords: formattedRecords.length,
    totalCostYtd,
    totalCostYtdDisplay: `$${totalCostYtd.toLocaleString()}`,
    avgCost:
      recordsThisYear.length > 0 ? totalCostYtd / recordsThisYear.length : 0,
    avgCostDisplay:
      recordsThisYear.length > 0
        ? `$${Math.round(totalCostYtd / recordsThisYear.length)}`
        : '$0',
  };

  const monthLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const now = new Date();
  const chartMonths: { key: string; label: string }[] = [];

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    chartMonths.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: monthLabels[date.getMonth()],
    });
  }

  const monthTotals = new Map(chartMonths.map((month) => [month.key, 0]));

  for (const record of formattedRecords) {
    const date = new Date(`${record.isoDate}T00:00:00`);
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (monthTotals.has(key)) {
      monthTotals.set(key, (monthTotals.get(key) ?? 0) + record.cost);
    }
  }

  const chartData = chartMonths.map((month) => ({
    month: month.label,
    value: Math.round(monthTotals.get(month.key) ?? 0),
  }));

  const assetNames = [
    ...new Set(formattedRecords.map((record) => record.assetName)),
  ].sort();

  return {
    records: formattedRecords,
    summary,
    chartData,
    assetNames,
  };
}
