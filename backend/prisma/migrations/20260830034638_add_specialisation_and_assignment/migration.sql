-- AlterTable
ALTER TABLE "MaintenanceRequest" ADD COLUMN     "assignedTechnicianId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "specialisation" TEXT;

-- AddForeignKey
ALTER TABLE "MaintenanceRequest" ADD CONSTRAINT "MaintenanceRequest_assignedTechnicianId_fkey" FOREIGN KEY ("assignedTechnicianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
