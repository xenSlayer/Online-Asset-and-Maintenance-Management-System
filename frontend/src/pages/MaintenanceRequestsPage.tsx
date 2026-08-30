import { useMemo, useState } from 'react';
import { maintenanceRequests as initialRequests } from '../data/maintenanceRequests';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { RequestForm } from '../components/maintenance/RequestForm';
import { RequestTable } from '../components/maintenance/RequestTable';
import { StatusTabs } from '../components/maintenance/StatusTabs';
import type { MaintenanceRequest, StatusTab } from '../types/maintenanceRequest';
import { getCurrentUser } from '../utils/auth';

type View = 'list' | 'form';

function filterByRole(
  requests: MaintenanceRequest[],
  role: string,
  userName: string,
) {
  if (role === 'Staff') {
    return requests.filter((request) => request.submittedBy === userName);
  }

  if (role === 'Technician') {
    return requests.filter(
      (request) => request.assignedTechnician === userName,
    );
  }

  return requests;
}

function getTabCounts(requests: MaintenanceRequest[]) {
  return [
    { key: 'all' as const, label: 'All Requests', count: requests.length },
    {
      key: 'Pending' as const,
      label: 'Pending',
      count: requests.filter((request) => request.status === 'Pending').length,
    },
    {
      key: 'Assigned' as const,
      label: 'Assigned',
      count: requests.filter((request) => request.status === 'Assigned').length,
    },
    {
      key: 'In Progress' as const,
      label: 'In Progress',
      count: requests.filter((request) => request.status === 'In Progress')
        .length,
    },
    {
      key: 'Completed' as const,
      label: 'Completed',
      count: requests.filter((request) => request.status === 'Completed')
        .length,
    },
  ];
}

export function MaintenanceRequestsPage() {
  const [view, setView] = useState<View>('list');
  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  const [requestList] = useState(initialRequests);
  const currentUser = getCurrentUser();

  const roleFilteredRequests = useMemo(
    () => filterByRole(requestList, currentUser.role, currentUser.name),
    [requestList, currentUser],
  );

  const tabs = useMemo(
    () => getTabCounts(roleFilteredRequests),
    [roleFilteredRequests],
  );

  const filteredRequests = useMemo(() => {
    if (activeTab === 'all') {
      return roleFilteredRequests;
    }

    return roleFilteredRequests.filter(
      (request) => request.status === activeTab,
    );
  }, [roleFilteredRequests, activeTab]);

  const canCreateRequest =
    currentUser.role === 'Admin' || currentUser.role === 'Staff';

  return (
    <DashboardLayout pageTitle="Maintenance Requests">
      {view === 'list' ? (
        <>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Maintenance Requests
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Track, assign, and resolve maintenance tasks
              </p>
            </div>
            {canCreateRequest && (
              <button
                type="button"
                onClick={() => setView('form')}
                className="btn-primary-gradient rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
              >
                + New Request
              </button>
            )}
          </div>

          <StatusTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />

          <RequestTable
            requests={filteredRequests}
            currentUser={currentUser}
            onView={() => undefined}
          />
        </>
      ) : (
        <RequestForm
          onCancel={() => setView('list')}
          onSubmit={() => setView('list')}
        />
      )}
    </DashboardLayout>
  );
}
