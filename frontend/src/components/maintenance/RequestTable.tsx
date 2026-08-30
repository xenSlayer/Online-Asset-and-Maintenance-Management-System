import { Avatar } from '../ui';
import type { CurrentUser, UserRole } from '../../utils/auth';
import type { MaintenanceRequest } from '../../types/maintenanceRequest';
import { PriorityBadge } from './PriorityBadge';
import { RequestStatusBadge } from './RequestStatusBadge';

interface RequestTableProps {
  requests: MaintenanceRequest[];
  currentUser: CurrentUser;
  actionLoadingId?: string;
  onReject: (request: MaintenanceRequest) => void;
  onAssign: (request: MaintenanceRequest) => void;
  onStartWork: (request: MaintenanceRequest) => void;
  onComplete: (request: MaintenanceRequest) => void;
}

function isUnassigned(request: MaintenanceRequest) {
  return request.status === 'Unassigned';
}

function isAssignedToCurrentUser(
  request: MaintenanceRequest,
  currentUser: CurrentUser,
) {
  return request.assignedTechnician === currentUser.name;
}

function getColumns(role: UserRole) {
  const base = ['Request', 'Asset', 'Priority', 'Date', 'Status'];

  if (role === 'Technician') {
    return [...base, 'Actions'];
  }

  if (role === 'Staff') {
    return [...base, 'Submitted By'];
  }

  return [...base, 'Submitted By', 'Actions'];
}

export function RequestTable({
  requests,
  currentUser,
  actionLoadingId,
  onReject,
  onAssign,
  onStartWork,
  onComplete,
}: RequestTableProps) {
  const isAdmin = currentUser.role === 'Admin';
  const isTechnician = currentUser.role === 'Technician';
  const columns = getColumns(currentUser.role);

  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-sm text-slate-500">No maintenance requests found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead className="border-b border-slate-200 bg-[#F8FAFC]">
            <tr>
              {columns.map((header) => (
                <th
                  key={header}
                  className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map((request) => {
              const isLoading = actionLoadingId === request.id;
              const isMyTask =
                isTechnician && isAssignedToCurrentUser(request, currentUser);

              return (
                <tr
                  key={request.id}
                  className="transition-colors hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-mono text-xs font-semibold text-slate-800">
                      {request.id}
                    </p>
                    <p className="mt-0.5 max-w-[180px] truncate text-xs text-slate-400">
                      {request.description}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-800">
                      {request.assetName}
                    </p>
                    <p className="font-mono text-xs text-slate-400">
                      {request.assetId}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <PriorityBadge priority={request.priority} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 font-mono text-xs text-slate-500">
                    {request.date}
                  </td>
                  <td className="px-5 py-4">
                    <RequestStatusBadge status={request.status} />
                    {request.assignedTechnician && (
                      <p className="mt-1 text-xs text-slate-400">
                        → {request.assignedTechnician}
                      </p>
                    )}
                  </td>
                  {!isTechnician && (
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Avatar name={request.submittedBy} />
                        <span className="text-sm text-slate-600">
                          {request.submittedBy}
                        </span>
                      </div>
                    </td>
                  )}
                  {(isAdmin || isTechnician) && (
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {isAdmin && isUnassigned(request) && (
                          <>
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => onAssign(request)}
                              className="btn-primary-gradient rounded-lg px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
                            >
                              Assign
                            </button>
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => onReject(request)}
                              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 disabled:opacity-60"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {isAdmin &&
                          (request.status === 'Assigned' ||
                            request.status === 'In Progress') &&
                          request.assignedTechnician && (
                            <button
                              type="button"
                              disabled={isLoading}
                              onClick={() => onAssign(request)}
                              className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-60"
                            >
                              Reassign
                            </button>
                          )}

                        {isMyTask && request.status === 'Assigned' && (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => onStartWork(request)}
                            className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-60"
                          >
                            Start Work
                          </button>
                        )}

                        {isMyTask && request.status === 'In Progress' && (
                          <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => onComplete(request)}
                            className="btn-primary-gradient rounded-lg px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
