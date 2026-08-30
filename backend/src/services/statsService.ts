import prisma from '../config/database';

export async function getPublicStats() {
  const [totalAssets, completedTasks, activeTechnicians] = await Promise.all([
    prisma.asset.count(),
    prisma.maintenanceRequest.count({ where: { status: 'Completed' } }),
    prisma.user.count({ where: { role: 'TECHNICIAN' } }),
  ]);

  return {
    totalAssets,
    completedTasks,
    activeTechnicians,
  };
}
