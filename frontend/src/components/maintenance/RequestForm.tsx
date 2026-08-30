import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import type { Asset } from '../../types/asset';
import type { RequestPriority } from '../../types/maintenanceRequest';
import { PriorityBadge } from './PriorityBadge';

interface RequestFormProps {
  assets: Asset[];
  saving?: boolean;
  error?: string;
  onCancel: () => void;
  onSubmit: (input: {
    assetId: string;
    description: string;
    priority: RequestPriority;
    requestDate: string;
  }) => Promise<void>;
}

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

export function RequestForm({
  assets,
  saving = false,
  error,
  onCancel,
  onSubmit,
}: RequestFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const [assetId, setAssetId] = useState(assets[0]?.id ?? '');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<RequestPriority>('Medium');
  const [requestDate, setRequestDate] = useState(today);

  useEffect(() => {
    if (assets.length === 0) {
      return;
    }

    setAssetId((current) => {
      if (current && assets.some((asset) => asset.id === current)) {
        return current;
      }

      return assets[0].id;
    });
  }, [assets]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!assetId) {
      return;
    }

    try {
      await onSubmit({
        assetId,
        description,
        priority,
        requestDate,
      });
    } catch {
      // Error is handled by the parent form state.
    }
  };

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
          <div>
            <FieldLabel>Asset</FieldLabel>
            <select
              value={assetId}
              onChange={(event) => setAssetId(event.target.value)}
              className={inputClass}
              required
            >
              {assets.length === 0 ? (
                <option value="">No assets available</option>
              ) : (
                assets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name} ({asset.id})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <FieldLabel>Request Date</FieldLabel>
            <input
              type="date"
              value={requestDate}
              onChange={(event) => setRequestDate(event.target.value)}
              className={inputClass}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>Issue Description</FieldLabel>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe the issue in detail…"
              rows={3}
              className={`${inputClass} h-24 resize-none`}
              required
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
        </div>

        <div className="mt-6 flex gap-3 border-t border-slate-100 pt-4">
          <button
            type="submit"
            disabled={saving || assets.length === 0}
            className="btn-primary-gradient rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? 'Submitting…' : 'Submit Request'}
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
