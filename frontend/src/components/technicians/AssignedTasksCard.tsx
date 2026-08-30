import type { TechnicianTask } from '../../types/technician';
import { RequestStatusBadge } from '../maintenance/RequestStatusBadge';

interface AssignedTasksCardProps {
  tasks: TechnicianTask[];
}

export function AssignedTasksCard({ tasks }: AssignedTasksCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-slate-800">Assigned Tasks</h3>

      {tasks.length === 0 ? (
        <p className="py-4 text-center text-sm italic text-slate-400">
          No tasks currently assigned.
        </p>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400">
                  {task.id}
                </span>
                <span className="text-sm font-medium text-slate-800">
                  {task.assetName}
                </span>
              </div>
              <RequestStatusBadge status={task.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
