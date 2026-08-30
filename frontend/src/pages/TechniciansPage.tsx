import { useState } from 'react';
import { technicians as technicianData } from '../data/technicians';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AssignedTasksCard } from '../components/technicians/AssignedTasksCard';
import { TechnicianList } from '../components/technicians/TechnicianList';
import { TechnicianProfileCard } from '../components/technicians/TechnicianProfileCard';
import type { Technician } from '../types/technician';

export function TechniciansPage() {
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(
    technicianData[0],
  );

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
        <button
          type="button"
          className="btn-primary-gradient rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
        >
          + Add Technician
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <TechnicianList
            technicians={technicianData}
            selectedId={selectedTechnician?.id ?? null}
            onSelect={setSelectedTechnician}
          />
        </div>

        <div className="lg:col-span-2">
          {selectedTechnician ? (
            <div className="space-y-4">
              <TechnicianProfileCard technician={selectedTechnician} />
              <AssignedTasksCard technician={selectedTechnician} />
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
    </DashboardLayout>
  );
}
