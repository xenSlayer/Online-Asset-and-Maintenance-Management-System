import prisma from '../config/database';

const ASSET_STATUS_COLORS: Record<string, string> = {
  Operational: '#059669',
  'Under Maintenance': '#D97706',
  'Out of Service': '#DC2626',
  Retired: '#94A3B8',
};

const MONTH_LABELS = [
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

function formatRequestId(id: number) {
  return `MR-${String(id).padStart(4, '0')}`;
}

function getLastSevenMonths() {
  const months: { key: string; label: string }[] = [];
  const now = new Date();

  for (let index = 6; index >= 0; index -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
    months.push({
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: MONTH_LABELS[date.getMonth()],
    });
  }

  return months;
}

function getQuarterStart() {
  const now = new Date();
  const quarterMonth = Math.floor(now.getMonth() / 3) * 3;
  return new Date(now.getFullYear(), quarterMonth, 1);
}

export async function getDashboardData() {
  const [
    totalUsers,
    totalAssets,
    pendingRequests,
    highPriorityPending,
    completedTasks,
    technicians,
    allAssets,
    activeMaintenanceAssetIds,
    recentRequests,
    maintenanceRequests,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.asset.count(),
    prisma.maintenanceRequest.count({
      where: { status: { not: 'Completed' } },
    }),
    prisma.maintenanceRequest.count({
      where: {
        status: { not: 'Completed' },
        priority: { in: ['High', 'Critical'] },
      },
    }),
    prisma.maintenanceRequest.count({ where: { status: 'Completed' } }),
    prisma.user.findMany({
      where: { role: 'TECHNICIAN' },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        specialisation: true,
        assignedRequests: {
          where: {
            status: { in: ['Assigned', 'In Progress'] },
          },
          select: { id: true },
        },
      },
    }),
    prisma.asset.findMany({
      select: { id: true, status: true },
    }),
    prisma.maintenanceRequest.findMany({
      where: { status: { not: 'Completed' } },
      select: { assetId: true },
      distinct: ['assetId'],
    }),
    prisma.maintenanceRequest.findMany({
      take: 4,
      orderBy: { requestDate: 'desc' },
      include: {
        asset: { select: { assetName: true } },
        user: { select: { name: true } },
      },
    }),
    prisma.maintenanceRequest.findMany({
      select: { requestDate: true },
    }),
  ]);

  const assetsUnderMaintenance = new Set(
    activeMaintenanceAssetIds.map((request) => request.assetId),
  );

  const assetStatusCounts = new Map<string, number>();

  for (const asset of allAssets) {
    let chartStatus = asset.status;

    if (
      assetsUnderMaintenance.has(asset.id) &&
      chartStatus === 'Operational'
    ) {
      chartStatus = 'Under Maintenance';
    }

    assetStatusCounts.set(
      chartStatus,
      (assetStatusCounts.get(chartStatus) ?? 0) + 1,
    );
  }

  const assetStatusBreakdown = [...assetStatusCounts.entries()]
    .map(([label, value]) => ({
      label,
      value,
      color: ASSET_STATUS_COLORS[label] ?? '#94A3B8',
    }))
    .sort((a, b) => b.value - a.value);

  const techniciansOnAssignment = technicians.filter(
    (technician) => technician.assignedRequests.length > 0,
  ).length;

  const monthBuckets = getLastSevenMonths();
  const monthCounts = new Map(monthBuckets.map((month) => [month.key, 0]));

  for (const request of maintenanceRequests) {
    const date = request.requestDate;
    const key = `${date.getFullYear()}-${date.getMonth()}`;

    if (monthCounts.has(key)) {
      monthCounts.set(key, (monthCounts.get(key) ?? 0) + 1);
    }
  }

  const maintenanceByMonth = monthBuckets.map((month) => ({
    month: month.label,
    value: monthCounts.get(month.key) ?? 0,
  }));

  const maintenanceTotal = maintenanceByMonth.reduce(
    (sum, item) => sum + item.value,
    0,
  );

  const firstMonth = monthBuckets[0]?.label ?? '';
  const lastMonth = monthBuckets[monthBuckets.length - 1]?.label ?? '';
  const currentYear = new Date().getFullYear();

  const quarterStart = getQuarterStart();
  const completedThisQuarter = await prisma.maintenanceRequest.count({
    where: {
      status: 'Completed',
      requestDate: { gte: quarterStart },
    },
  });

  return {
    summary: {
      totalUsers,
      totalAssets,
      pendingRequests,
      highPriorityPending,
      completedTasks,
      availableTechnicians: technicians.length - techniciansOnAssignment,
      techniciansOnAssignment,
      completedThisQuarter,
    },
    maintenanceByMonth,
    maintenanceTotal,
    maintenancePeriodLabel: `${firstMonth} – ${lastMonth} ${currentYear}`,
    assetStatusBreakdown,
    recentRequests: recentRequests.map((request) => ({
      id: formatRequestId(request.id),
      asset: request.asset.assetName,
      priority: request.priority,
      status: request.status,
      submittedBy: request.user.name,
    })),
    technicians: technicians.map((technician) => ({
      name: technician.name,
      specialisation: technician.specialisation ?? 'General Maintenance',
      availability:
        technician.assignedRequests.length > 0
          ? ('On Assignment' as const)
          : ('Available' as const),
    })),
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
