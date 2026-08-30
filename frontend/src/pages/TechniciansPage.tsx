import { useCallback, useEffect, useState } from 'react';
import {
  fetchTechnician,
  fetchTechnicians,
  updateTechnician,
} from '../api/technicians';
import { createUser } from '../api/users';
import { UserForm } from '../components/users/UserForm';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AssignedTasksCard } from '../components/technicians/AssignedTasksCard';
import { TechnicianList } from '../components/technicians/TechnicianList';
import { TechnicianProfileCard } from '../components/technicians/TechnicianProfileCard';
import { TechnicianProfileForm } from '../components/technicians/TechnicianProfileForm';
import type { Technician, TechnicianDetail } from '../types/technician';
import type { UserRole, UserStatus } from '../types/user';

type View = 'list' | 'edit' | 'add';

export function TechniciansPage() {
  const [view, setView] = useState<View>('list');
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedTechnician, setSelectedTechnician] =
    useState<TechnicianDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const loadTechnicians = useCallback(async (selectedId?: string) => {
    try {
      const data = await fetchTechnicians();
      setTechnicians(data);
      setError('');

      const idToLoad = selectedId ?? data[0]?.id;

      if (idToLoad) {
        const detail = await fetchTechnician(idToLoad);
        setSelectedTechnician(detail);
      } else {
        setSelectedTechnician(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load technicians',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTechnicians();
  }, [loadTechnicians]);

  const handleSelect = async (technician: Technician) => {
    setDetailLoading(true);
    setView('list');

    try {
      const detail = await fetchTechnician(technician.id);
      setSelectedTechnician(detail);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load technician',
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const openAddForm = () => {
    setFormError('');
    setView('add');
  };

  const openEditForm = () => {
    setFormError('');
    setView('edit');
  };

  const closeEditForm = () => {
    setFormError('');
    setView('list');
  };

  const handleCreateTechnician = async (input: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    password?: string;
    specialisation?: string;
  }) => {
    if (!input.password) {
      setFormError('Password is required for new technicians');
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      await createUser({
        ...input,
        password: input.password,
      });
      await loadTechnicians();
      closeEditForm();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Failed to create technician',
      );
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async (input: {
    name: string;
    email: string;
    phone: string;
    specialisation: string;
    status: UserStatus;
    password?: string;
  }) => {
    if (!selectedTechnician) {
      return;
    }

    setSaving(true);
    setFormError('');

    try {
      const updated = await updateTechnician(selectedTechnician.id, input);
      setSelectedTechnician(updated);
      await loadTechnicians(updated.id);
      closeEditForm();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : 'Failed to update technician',
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout pageTitle="Technician Management">
      {view === 'list' && (
        <>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Technician Management
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                View technician profiles and manage assignments
              </p>
            </div>
            <button
              type="button"
              onClick={openAddForm}
              className="btn-primary-gradient rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
            >
              + Add Technician
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Loading technicians…
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-1">
                <TechnicianList
                  technicians={technicians}
                  selectedId={selectedTechnician?.id ?? null}
                  onSelect={handleSelect}
                />
              </div>

              <div className="lg:col-span-2">
                {detailLoading ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                    Loading profile…
                  </div>
                ) : selectedTechnician ? (
                  <div className="space-y-4">
                    <TechnicianProfileCard
                      technician={selectedTechnician}
                      onEdit={openEditForm}
                    />
                    <AssignedTasksCard tasks={selectedTechnician.tasks} />
                  </div>
                ) : (
                  <div className="flex h-48 min-h-[12rem] items-center justify-center rounded-xl border-2 border-dashed border-slate-200">
                    <p className="text-sm text-slate-400">
                      Select a technician to view their profile
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {view === 'add' && (
        <UserForm
          defaultRole="Technician"
          lockRole
          backLabel="Back to Technicians"
          title="Add Technician"
          subtitle="Create a new technician account"
          saving={saving}
          error={formError}
          onCancel={closeEditForm}
          onSave={handleCreateTechnician}
        />
      )}

      {view === 'edit' && selectedTechnician && (
        <TechnicianProfileForm
          key={selectedTechnician.id}
          technician={selectedTechnician}
          saving={saving}
          error={formError}
          onCancel={closeEditForm}
          onSave={handleSave}
        />
      )}
    </DashboardLayout>
  );
}
