import { MapPin } from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import type { Asset, AssetCategory, AssetStatus } from '../../types/asset';

interface AssetFormProps {
  asset?: Asset | null;
  saving?: boolean;
  error?: string;
  onCancel: () => void;
  onSave: (input: {
    name: string;
    category: AssetCategory;
    serialNo: string;
    description: string;
    location: string;
    purchaseDate: string;
    status: AssetStatus;
    assignedTo: string;
  }) => Promise<void>;
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

export function AssetForm({
  asset,
  saving = false,
  error,
  onCancel,
  onSave,
}: AssetFormProps) {
  const [name, setName] = useState(asset?.name ?? '');
  const [category, setCategory] = useState<AssetCategory | ''>(
    asset?.category ?? '',
  );
  const [serialNo, setSerialNo] = useState(asset?.serialNo ?? '');
  const [description, setDescription] = useState(asset?.description ?? '');
  const [purchaseDate, setPurchaseDate] = useState(asset?.purchaseDate ?? '');
  const [location, setLocation] = useState(asset?.location ?? '');
  const [status, setStatus] = useState<AssetStatus | ''>(asset?.status ?? '');
  const [assignedTo, setAssignedTo] = useState(
    asset?.assignedTo ?? 'Unassigned',
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!category || !status) {
      return;
    }

    await onSave({
      name,
      category,
      serialNo,
      description,
      location,
      purchaseDate,
      status,
      assignedTo,
    });
  };

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

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {asset && (
            <div>
              <FieldLabel>Asset ID</FieldLabel>
              <input
                type="text"
                value={asset.id}
                readOnly
                className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
              />
            </div>
          )}

          <div className={asset ? '' : 'sm:col-span-2'}>
            <FieldLabel>Asset Name</FieldLabel>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Descriptive name"
              className={inputClass}
              required
            />
          </div>

          <div>
            <FieldLabel>Asset Category</FieldLabel>
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as AssetCategory)
              }
              className={inputClass}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Serial Number</FieldLabel>
            <input
              type="text"
              value={serialNo}
              onChange={(event) => setSerialNo(event.target.value)}
              placeholder="Manufacturer serial"
              className={inputClass}
            />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>Description</FieldLabel>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Brief description…"
              rows={3}
              className={`${inputClass} h-20 resize-none`}
            />
          </div>

          <div>
            <FieldLabel>Purchase Date</FieldLabel>
            <input
              type="date"
              value={purchaseDate}
              onChange={(event) => setPurchaseDate(event.target.value)}
              className={inputClass}
              required
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
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Building / floor / room"
                className={`${inputClass} pl-9`}
                required
              />
            </div>
          </div>

          <div>
            <FieldLabel>Asset Status</FieldLabel>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as AssetStatus)
              }
              className={inputClass}
              required
            >
              <option value="" disabled>
                Select status
              </option>
              {statuses.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Assigned To</FieldLabel>
            <select
              value={assignedTo}
              onChange={(event) => setAssignedTo(event.target.value)}
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
            type="submit"
            disabled={saving}
            className="btn-primary-gradient rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Asset'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
