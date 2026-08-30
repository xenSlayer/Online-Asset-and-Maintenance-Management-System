import { Mail, Smartphone } from 'lucide-react';
import type { ReactNode } from 'react';
import type { User, UserRole, UserStatus } from '../../types/user';

interface UserFormProps {
  user?: User | null;
  onCancel: () => void;
  onSave: () => void;
}

const roleOptions: { value: UserRole; label: string }[] = [
  { value: 'Admin', label: 'Administrator' },
  { value: 'Staff', label: 'Staff / User' },
  { value: 'Technician', label: 'Technician' },
];

const statusOptions: UserStatus[] = ['Active', 'Inactive', 'Suspended'];

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
      {children}
    </label>
  );
}

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 transition-all focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100';

export function UserForm({ user, onCancel, onSave }: UserFormProps) {
  return (
    <div>
      <button
        type="button"
        onClick={onCancel}
        className="mb-5 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800"
      >
        ← Back to Users
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Add / Edit User</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Fill in user details and assign a role
        </p>
      </div>

      <div className="max-w-2xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>User ID</FieldLabel>
            <input
              type="text"
              defaultValue={user?.id ?? 'Auto-generated'}
              readOnly
              className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
            />
          </div>

          <div>
            <FieldLabel>Full Name</FieldLabel>
            <input
              type="text"
              defaultValue={user?.name ?? ''}
              placeholder="First and last name"
              className={inputClass}
            />
          </div>

          <div>
            <FieldLabel>Email Address</FieldLabel>
            <div className="relative">
              <Mail
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                defaultValue={user?.email ?? ''}
                placeholder="user@assetcore.com"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Phone Number</FieldLabel>
            <div className="relative">
              <Smartphone
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="tel"
                defaultValue={user?.phone ?? ''}
                placeholder="+1 555 0000"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Role</FieldLabel>
            <select
              defaultValue={user?.role ?? ''}
              className={inputClass}
            >
              <option value="" disabled>
                Select role
              </option>
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel>Account Status</FieldLabel>
            <select
              defaultValue={user?.status ?? 'Active'}
              className={inputClass}
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
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
            Save User
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
