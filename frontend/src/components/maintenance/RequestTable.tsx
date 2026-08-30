import { Avatar } from '../ui';
import type { CurrentUser } from '../../utils/auth';
import type { MaintenanceRequest } from '../../types/maintenanceRequest';
import { PriorityBadge } from './PriorityBadge';
import { RequestStatusBadge } from './RequestStatusBadge';

interface RequestTableProps {
  requests: MaintenanceRequest[];
  currentUser: CurrentUser;
  onView: (request: MaintenanceRequest) => void;
}

export function RequestTable({
  requests,
  currentUser,
  onView,
}: RequestTableProps) {
  const isAdmin = currentUser.role === 'Admin';
  const isTechnician = currentUser.role === 'Technician';

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px]">
          <thead className="border-b border-slate-200 bg-[#F8FAFC]">
            <tr>
              {[
                'Request',
                'Asset',
                'Priority',
                'Date',
                'Status',
                'Submitted By',
                'Actions',
              ].map((header) => (
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
            {requests.map((request) => (
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
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <Avatar name={request.submittedBy} />
                    <span className="text-sm text-slate-600">
                      {request.submittedBy}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => onView(request)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    >
                      View
                    </button>

                    {isAdmin && request.status === 'Pending' && (
                      <>
                        <button
                          type="button"
                          className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                        >
                          Assign
                        </button>
                      </>
                    )}

                    {isTechnician &&
                      (request.status === 'Assigned' ||
                        request.status === 'In Progress') &&
                      request.assignedTechnician === currentUser.name && (
                        <button
                          type="button"
                          className="btn-primary-gradient rounded-lg px-3 py-1.5 text-xs font-medium text-white"
                        >
                          Update
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
