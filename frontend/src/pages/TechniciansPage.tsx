import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchTechnician, fetchTechnicians } from '../api/technicians';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AssignedTasksCard } from '../components/technicians/AssignedTasksCard';
import { TechnicianList } from '../components/technicians/TechnicianList';
import { TechnicianProfileCard } from '../components/technicians/TechnicianProfileCard';
import type { Technician, TechnicianDetail } from '../types/technician';

export function TechniciansPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [selectedTechnician, setSelectedTechnician] =
    useState<TechnicianDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState('');

  const loadTechnicians = useCallback(async () => {
    try {
      const data = await fetchTechnicians();
      setTechnicians(data);
      setError('');

      if (data.length > 0) {
        const detail = await fetchTechnician(data[0].id);
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

  return (
    <DashboardLayout pageTitle="Technician Management">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Technician Management
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            View technician profiles and manage assignments
          </p>
        </div>
        <Link
          to="/users"
          className="btn-primary-gradient rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
        >
          + Add Technician
        </Link>
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
                <TechnicianProfileCard technician={selectedTechnician} />
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
    </DashboardLayout>
  );
}
