import { useState, type ReactNode } from 'react';
import type { RequestPriority } from '../../types/maintenanceRequest';
import { getCurrentUser } from '../../utils/auth';
import { PriorityBadge } from './PriorityBadge';

interface RequestFormProps {
  onCancel: () => void;
  onSubmit: () => void;
}

const assetOptions = [
  { value: 'AST-001', label: 'HVAC Unit 3 (AST-001)' },
  { value: 'AST-002', label: 'Forklift #7 (AST-002)' },
  { value: 'AST-003', label: 'Server Rack A (AST-003)' },
  { value: 'AST-004', label: 'Printer B2 (AST-004)' },
];

const priorities: RequestPriority[] = ['Low', 'Medium', 'High', 'Critical'];

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100';

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
      {children}
    </label>
  );
}

export function RequestForm({ onCancel, onSubmit }: RequestFormProps) {
  const currentUser = getCurrentUser();
  const [priority, setPriority] = useState<RequestPriority>('Medium');
  return (
    <div>
      <button
        type="button"
        onClick={onCancel}
        className="mb-5 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800"
      >
        ← Back to Requests
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">
          Create Maintenance Request
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Describe the issue and select priority level
        </p>
      </div>

      <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Request ID</FieldLabel>
            <input
              type="text"
              defaultValue="Auto-generated"
              readOnly
              className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
            />
          </div>

          <div>
            <FieldLabel>Asset</FieldLabel>
            <select className={inputClass} defaultValue="AST-001">
              {assetOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>Issue Description</FieldLabel>
            <textarea
              placeholder="Describe the issue in detail…"
              rows={3}
              className={`${inputClass} h-24 resize-none`}
            />
          </div>

          <div>
            <FieldLabel>Priority Level</FieldLabel>
            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value as RequestPriority)
              }
              className={inputClass}
            >
              {priorities.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <PriorityBadge priority={priority} className="mt-2" />
          </div>

          <div>
            <FieldLabel>Request Date</FieldLabel>
            <input type="date" className={inputClass} />
          </div>

          <div>
            <FieldLabel>Submitted By</FieldLabel>
            <input
              type="text"
              defaultValue={currentUser?.name ?? ''}
              readOnly
              className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
            />
          </div>

          <div>
            <FieldLabel>Request Status</FieldLabel>
            <select
              defaultValue="Pending"
              disabled
              className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
            >
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onSubmit}
            className="btn-primary-gradient rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Submit Request
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
