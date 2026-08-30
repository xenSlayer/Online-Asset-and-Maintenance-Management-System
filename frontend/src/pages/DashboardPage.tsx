import { DashboardLayout } from '../layouts/DashboardLayout';
import { AssetDonutChart } from '../components/dashboard/AssetDonutChart';
import { MaintenanceBarChart } from '../components/dashboard/MaintenanceBarChart';
import { RecentRequests } from '../components/dashboard/RecentRequests';
import { SummaryCards } from '../components/dashboard/SummaryCards';
import { TechnicianAvailability } from '../components/dashboard/TechnicianAvailability';
import { useDashboard } from '../hooks/useDashboard';
import { getCurrentUser } from '../utils/auth';

const roleLabels: Record<string, string> = {
  Admin: 'Administrator',
  Staff: 'Staff User',
  Technician: 'Technician',
};

export function DashboardPage() {
  const { data, loading, error } = useDashboard();
  const user = getCurrentUser();
  const roleLabel = user ? roleLabels[user.role] ?? user.role : 'User';

  return (
    <DashboardLayout pageTitle="Dashboard">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Welcome back{user ? `, ${user.name}` : ''} · {roleLabel} view
        </p>
      </div>

      {loading && (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Loading dashboard…
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {data && !loading && (
        <div className="mt-6">
          <SummaryCards summary={data.summary} />

          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <MaintenanceBarChart
              data={data.maintenanceByMonth}
              total={data.maintenanceTotal}
              periodLabel={data.maintenancePeriodLabel}
            />
            <AssetDonutChart segments={data.assetStatusBreakdown} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <RecentRequests requests={data.recentRequests} />
            <TechnicianAvailability technicians={data.technicians} />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
