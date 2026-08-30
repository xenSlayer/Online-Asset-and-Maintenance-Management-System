import { Mail, Smartphone } from 'lucide-react';
import { useState, type FormEvent, type ReactNode } from 'react';
import type { TechnicianDetail } from '../../types/technician';
import type { UserStatus } from '../../types/user';

interface TechnicianProfileFormProps {
  technician: TechnicianDetail;
  saving?: boolean;
  error?: string;
  onCancel: () => void;
  onSave: (input: {
    name: string;
    email: string;
    phone: string;
    specialisation: string;
    status: UserStatus;
    password?: string;
  }) => Promise<void>;
}

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

export function TechnicianProfileForm({
  technician,
  saving = false,
  error,
  onCancel,
  onSave,
}: TechnicianProfileFormProps) {
  const [name, setName] = useState(technician.name);
  const [email, setEmail] = useState(technician.email);
  const [phone, setPhone] = useState(technician.phone);
  const [specialisation, setSpecialisation] = useState(technician.specialisation);
  const [status, setStatus] = useState<UserStatus>(
    (technician.status as UserStatus) || 'Active',
  );
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      await onSave({
        name,
        email,
        phone,
        specialisation,
        status,
        password: password || undefined,
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
        ← Back to Profile
      </button>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Edit Technician Profile</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Update contact details and specialisation
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
            <FieldLabel>Technician ID</FieldLabel>
            <input
              type="text"
              value={technician.id}
              readOnly
              className={`${inputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
            />
          </div>

          <div>
            <FieldLabel>Full Name</FieldLabel>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
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
                className={`${inputClass} pl-9`}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Specialisation</FieldLabel>
            <input
              type="text"
              value={specialisation}
              onChange={(event) => setSpecialisation(event.target.value)}
              placeholder="e.g. Electrical, HVAC"
              className={inputClass}
              required
            />
          </div>

          <div>
            <FieldLabel>Account Status</FieldLabel>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as UserStatus)}
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
            <FieldLabel>New Password (optional)</FieldLabel>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Leave blank to keep current password"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3 border-t border-slate-100 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary-gradient rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save Profile'}
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
