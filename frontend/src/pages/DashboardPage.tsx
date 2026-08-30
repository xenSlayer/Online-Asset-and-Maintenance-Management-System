import { DashboardLayout } from '../layouts/DashboardLayout';
import { AssetDonutChart } from '../components/dashboard/AssetDonutChart';
import { MaintenanceBarChart } from '../components/dashboard/MaintenanceBarChart';
import { RecentRequests } from '../components/dashboard/RecentRequests';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { TechnicianAvailability } from '../components/dashboard/TechnicianAvailability';

export function DashboardPage() {
  return (
    <DashboardLayout pageTitle="Dashboard">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Good morning · Administrator view
        </p>
      </div>

      <div className="mt-6">
        <SummaryCards />

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <MaintenanceBarChart />
          <AssetDonutChart />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <RecentRequests />
          <TechnicianAvailability />
        </div>
      </div>
    </DashboardLayout>
  );
}
