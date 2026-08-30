import { MapPin } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Asset, AssetCategory, AssetStatus } from '../../types/asset';

interface AssetFormProps {
  asset?: Asset | null;
  onCancel: () => void;
  onSave: () => void;
}

const categories: AssetCategory[] = [
  'Mechanical',
  'Electrical',
  'IT Equipment',
  'Vehicle',
  'Office Equipment',
];

const statuses: AssetStatus[] = [
  'Operational',
  'Under Maintenance',
  'Out of Service',
  'Retired',
];

const assignees = [
  'Unassigned',
  'Facilities',
  'IT Dept',
  'Warehouse Team',
  'Admin',
];

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100';

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
      {children}
    </label>
  );
}

export function AssetForm({ asset, onCancel, onSave }: AssetFormProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onCancel}
        className="mb-5 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800"
      >
        ← Back to Assets
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Add / Edit Asset</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Enter asset details and assign ownership
        </p>
      </div>

      <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Asset ID</FieldLabel>
            <input
              type="text"
              defaultValue={asset?.id ?? 'Auto-generated'}
              readOnly
              className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
            />
          </div>

          <div>
            <FieldLabel>Asset Name</FieldLabel>
            <input
              type="text"
              defaultValue={asset?.name ?? ''}
              placeholder="Descriptive name"
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel>Asset Category</FieldLabel>
            <select defaultValue={asset?.category ?? ''} className={inputClass}>
              <option value="" disabled>
                Select category
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Serial Number</FieldLabel>
            <input
              type="text"
              defaultValue={asset?.serialNo ?? ''}
              placeholder="Manufacturer serial"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>Description</FieldLabel>
            <textarea
              defaultValue={asset?.description ?? ''}
              placeholder="Brief description…"
              rows={3}
              className={`${inputClass} h-20 resize-none`}
            />
          </div>

          <div>
            <FieldLabel>Purchase Date</FieldLabel>
            <input
              type="date"
              defaultValue={asset?.purchaseDate ? '2021-03-12' : ''}
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel>Location</FieldLabel>
            <div className="relative">
              <MapPin
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                defaultValue={asset?.location ?? ''}
                placeholder="Building / floor / room"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Asset Status</FieldLabel>
            <select defaultValue={asset?.status ?? ''} className={inputClass}>
              <option value="" disabled>
                Select status
              </option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Assigned To</FieldLabel>
            <select
              defaultValue={asset?.assignedTo ?? 'Unassigned'}
              className={inputClass}
            >
              {assignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onSave}
            className="btn-primary-gradient rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
          >
            Save Asset
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
