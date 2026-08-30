import { useCallback, useEffect, useMemo, useState } from 'react';
import { fetchAssets } from '../api/assets';
import {
  assignMaintenanceRequest,
  completeMaintenanceRequest,
  createMaintenanceRequest,
  fetchMaintenanceRequests,
  progressMaintenanceRequest,
  rejectMaintenanceRequest,
} from '../api/maintenanceRequests';
import { fetchTechnicians } from '../api/technicians';
import { RequestForm } from '../components/maintenance/RequestForm';
import { RequestTable } from '../components/maintenance/RequestTable';
import { StatusTabs } from '../components/maintenance/StatusTabs';
import { DashboardLayout } from '../layouts/DashboardLayout';
import type { Asset } from '../types/asset';
import type { MaintenanceRequest, StatusTab } from '../types/maintenanceRequest';
import type { Technician } from '../types/technician';
import { getCurrentUser } from '../utils/auth';

type View = 'list' | 'form';

function isUnassigned(request: MaintenanceRequest) {
  return !request.assignedTechnicianId && !request.assignedTechnician;
}

function getTabCounts(requests: MaintenanceRequest[]) {
  return [
    { key: 'all' as const, label: 'All Requests', count: requests.length },
    {
      key: 'unassigned' as const,
      label: 'Unassigned',
      count: requests.filter(isUnassigned).length,
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
  ];
}

export function MaintenanceRequestsPage() {
  const [view, setView] = useState<View>('list');
  const [activeTab, setActiveTab] = useState<StatusTab>('all');
  const [requestList, setRequestList] = useState<MaintenanceRequest[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState('');
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [assigningRequest, setAssigningRequest] =
    useState<MaintenanceRequest | null>(null);
  const [selectedTechnicianId, setSelectedTechnicianId] = useState('');
  const [completingRequest, setCompletingRequest] =
    useState<MaintenanceRequest | null>(null);
  const [completeCost, setCompleteCost] = useState('');
  const [completeParts, setCompleteParts] = useState('');
  const [completeDescription, setCompleteDescription] = useState('');

  const currentUser = getCurrentUser() ?? {
    id: 0,
    role: 'Admin' as const,
    name: 'Guest',
    email: '',
    token: '',
  };

  const loadRequests = useCallback(async () => {
    try {
      const requests = await fetchMaintenanceRequests();
      setRequestList(requests);
      setError('');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load maintenance requests',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const loadFormData = useCallback(async () => {
    try {
      const [assetList, technicianList] = await Promise.all([
        fetchAssets(),
        fetchTechnicians(),
      ]);
      setAssets(assetList);
      setTechnicians(technicianList);
    } catch {
      // Form-specific data; list view can still work.
    }
  }, []);

  useEffect(() => {
    loadRequests();
    loadFormData();
  }, [loadRequests, loadFormData]);

  const tabs = useMemo(() => getTabCounts(requestList), [requestList]);

  const filteredRequests = useMemo(() => {
    if (activeTab === 'all') {
      return requestList;
    }

    if (activeTab === 'unassigned') {
      return requestList.filter(isUnassigned);
    }

    return requestList.filter((request) => request.status === activeTab);
  }, [requestList, activeTab]);

  const canCreateRequest =
    currentUser.role === 'Admin' || currentUser.role === 'Staff';

  const handleCreate = async (input: {
    assetId: string;
    description: string;
    priority: MaintenanceRequest['priority'];
    requestDate: string;
  }) => {
    setSaving(true);
    setFormError('');

    try {
      await createMaintenanceRequest(input);
      await loadRequests();
      setView('list');
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Failed to create request',
      );
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const runAction = async (
    requestId: string,
    action: () => Promise<unknown>,
  ) => {
    setActionLoadingId(requestId);
    setError('');

    try {
      await action();
      await loadRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoadingId('');
    }
  };

  const handleReject = (request: MaintenanceRequest) => {
    if (!window.confirm(`Reject request ${request.id}?`)) {
      return;
    }

    runAction(request.id, () => rejectMaintenanceRequest(request.id));
  };

  const handleAssignClick = (request: MaintenanceRequest) => {
    setAssigningRequest(request);
    setSelectedTechnicianId(request.assignedTechnicianId ?? '');
    setError('');
  };

  const handleAssignConfirm = async () => {
    if (!assigningRequest) {
      return;
    }

    await runAction(assigningRequest.id, () =>
      assignMaintenanceRequest(
        assigningRequest.id,
        selectedTechnicianId || null,
      ),
    );

    setAssigningRequest(null);
    setSelectedTechnicianId('');
  };

  const handleUpdate = (request: MaintenanceRequest) => {
    if (request.status === 'Assigned') {
      runAction(request.id, () => progressMaintenanceRequest(request.id));
      return;
    }

    setCompletingRequest(request);
    setCompleteCost('');
    setCompleteParts('');
    setCompleteDescription(request.description);
    setError('');
  };

  const handleCompleteConfirm = async () => {
    if (!completingRequest) {
      return;
    }

    const cost = completeCost ? Number(completeCost) : 0;

    if (Number.isNaN(cost) || cost < 0) {
      setError('Please enter a valid cost');
      return;
    }

    await runAction(completingRequest.id, () =>
      completeMaintenanceRequest(completingRequest.id, {
        cost,
        partsReplaced: completeParts,
        repairDescription: completeDescription,
      }),
    );

    setCompletingRequest(null);
  };

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
                onClick={() => {
                  setFormError('');
                  void loadFormData();
                  setView('form');
                }}
                className="btn-primary-gradient rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
              >
                + New Request
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {assigningRequest && (
            <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
              <p className="mb-3 text-sm font-medium text-slate-800">
                {assigningRequest.assignedTechnician
                  ? `Update assignment for ${assigningRequest.id}`
                  : `Assign technician to ${assigningRequest.id}`}
              </p>
              <div className="flex flex-wrap items-end gap-3">
                <div className="min-w-[220px]">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Technician
                  </label>
                  <select
                    value={selectedTechnicianId}
                    onChange={(event) =>
                      setSelectedTechnicianId(event.target.value)
                    }
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                  >
                    <option value="">Unassigned</option>
                    {technicians.map((technician) => (
                      <option key={technician.id} value={technician.id}>
                        {technician.name} — {technician.specialisation}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  disabled={
                    actionLoadingId !== '' ||
                    (!selectedTechnicianId &&
                      !assigningRequest.assignedTechnicianId)
                  }
                  onClick={handleAssignConfirm}
                  className="btn-primary-gradient rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm disabled:opacity-60"
                >
                  {selectedTechnicianId
                    ? assigningRequest.assignedTechnician
                      ? 'Save Assignment'
                      : 'Assign Technician'
                    : 'Remove Assignment'}
                </button>
                <button
                  type="button"
                  onClick={() => setAssigningRequest(null)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {completingRequest && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
              <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
                <h2 className="text-lg font-bold text-slate-900">
                  Complete {completingRequest.id}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Record repair details to create a maintenance record.
                </p>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Repair Description
                    </label>
                    <textarea
                      value={completeDescription}
                      onChange={(event) =>
                        setCompleteDescription(event.target.value)
                      }
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Parts Replaced
                    </label>
                    <input
                      type="text"
                      value={completeParts}
                      onChange={(event) => setCompleteParts(event.target.value)}
                      placeholder="e.g. Air filter, belt"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Cost ($)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={completeCost}
                      onChange={(event) => setCompleteCost(event.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    disabled={actionLoadingId !== ''}
                    onClick={handleCompleteConfirm}
                    className="btn-primary-gradient rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm disabled:opacity-60"
                  >
                    Complete Request
                  </button>
                  <button
                    type="button"
                    onClick={() => setCompletingRequest(null)}
                    className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <StatusTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-sm text-slate-500">Loading requests…</p>
            </div>
          ) : (
            <RequestTable
              requests={filteredRequests}
              currentUser={currentUser}
              actionLoadingId={actionLoadingId}
              onReject={handleReject}
              onAssign={handleAssignClick}
              onUpdate={handleUpdate}
            />
          )}
        </>
      ) : (
        <RequestForm
          assets={assets}
          saving={saving}
          error={formError}
          onCancel={() => setView('list')}
          onSubmit={handleCreate}
        />
      )}
    </DashboardLayout>
  );
}
