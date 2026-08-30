import { assignmentTaskPool } from '../../data/technicians';
import type { Technician } from '../../types/technician';
import { RequestStatusBadge } from '../maintenance/RequestStatusBadge';

interface AssignedTasksCardProps {
  technician: Technician;
}

export function AssignedTasksCard({ technician }: AssignedTasksCardProps) {
  const tasks = assignmentTaskPool.slice(0, technician.activeTasks);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-bold text-slate-800">Assigned Tasks</h3>

      {tasks.length === 0 ? (
        <p className="py-4 text-center text-sm italic text-slate-400">
          No tasks currently assigned.
        </p>
      ) : (
        <div className="mb-4 space-y-2">
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

      <div className="border-t border-slate-100 pt-4">
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
          Assign New Request
        </label>
        <div className="flex gap-2">
          <select
            defaultValue=""
            className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          >
            <option value="" disabled>
              Select maintenance request…
            </option>
            <option value="MR-0041">
              MR-0041 — HVAC Unit 3 (Pending)
            </option>
          </select>
          <button
            type="button"
            className="btn-primary-gradient rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
}
