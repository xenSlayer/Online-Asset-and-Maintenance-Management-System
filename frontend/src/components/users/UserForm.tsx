import { Mail, Smartphone } from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import type { User, UserRole, UserStatus } from '../../types/user';

interface UserFormProps {
  user?: User | null;
  saving?: boolean;
  error?: string;
  defaultRole?: UserRole;
  lockRole?: boolean;
  backLabel?: string;
  title?: string;
  subtitle?: string;
  onCancel: () => void;
  onSave: (input: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    password?: string;
    specialisation?: string;
  }) => Promise<void>;
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

export function UserForm({
  user,
  saving = false,
  error,
  defaultRole,
  lockRole = false,
  backLabel = 'Back to Users',
  title = 'Add / Edit User',
  subtitle = 'Fill in user details and assign a role',
  onCancel,
  onSave,
}: UserFormProps) {
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [role, setRole] = useState<UserRole | ''>(user?.role ?? defaultRole ?? '');
  const [specialisation, setSpecialisation] = useState('');
  const [status, setStatus] = useState<UserStatus>(user?.status ?? 'Active');
  const [password, setPassword] = useState('');

  const isTechnicianRole = role === 'Technician';

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!role) {
      return;
    }

    await onSave({
      name,
      email,
      phone,
      role,
      status,
      password: password || undefined,
      specialisation: isTechnicianRole ? specialisation : undefined,
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={onCancel}
        className="mb-5 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-800"
      >
        ← {backLabel}
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">{title}</h1>
        <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>
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
          {user && (
            <div>
              <FieldLabel>User ID</FieldLabel>
              <input
                type="text"
                value={user.id}
                readOnly
                className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
              />
            </div>
          )}

          <div className={user ? '' : 'sm:col-span-2'}>
            <FieldLabel>Full Name</FieldLabel>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="First and last name"
              className={inputClass}
              required
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
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="user@company.com"
                className={`${inputClass} pl-9`}
                required
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
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+1 555 0000"
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Role</FieldLabel>
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as UserRole)}
              className={`${inputClass} ${lockRole ? 'cursor-not-allowed bg-slate-50 text-slate-500' : ''}`}
              required
              disabled={lockRole}
            >
              {!lockRole && (
                <option value="" disabled>
                  Select role
                </option>
              )}
              {roleOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {isTechnicianRole && (
            <div>
              <FieldLabel>Specialisation</FieldLabel>
              <input
                type="text"
                value={specialisation}
                onChange={(event) => setSpecialisation(event.target.value)}
                placeholder="e.g. Electrical, HVAC, Mechanical"
                className={inputClass}
              />
            </div>
          )}

          <div>
            <FieldLabel>Account Status</FieldLabel>
            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as UserStatus)
              }
              className={inputClass}
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>
              {user ? 'New Password (optional)' : 'Password'}
            </FieldLabel>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder={user ? 'Leave blank to keep current password' : 'Enter password'}
              className={inputClass}
              required={!user}
              minLength={user ? undefined : 3}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3 border-t border-slate-100 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary-gradient rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save User'}
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
