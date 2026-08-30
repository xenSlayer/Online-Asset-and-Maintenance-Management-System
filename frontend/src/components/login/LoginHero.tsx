import { useEffect, useState } from 'react';
import { fetchPublicStats, type PublicStats } from '../../api/stats';
import { Logo } from '../ui/Logo';

const statLabels: { key: keyof PublicStats; label: string }[] = [
  { key: 'totalAssets', label: 'Assets Tracked' },
  { key: 'completedTasks', label: 'Tasks Completed' },
  { key: 'activeTechnicians', label: 'Active Technicians' },
];

function formatStatValue(value: number | null) {
  if (value === null) {
    return '—';
  }

  return value.toLocaleString();
}

export function LoginHero() {
  const [stats, setStats] = useState<PublicStats | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchPublicStats()
      .then((data) => {
        if (!cancelled) {
          setStats(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setStats({ totalAssets: 0, completedTasks: 0, activeTechnicians: 0 });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="hero-gradient relative hidden min-h-screen flex-col px-10 py-10 text-white lg:flex lg:px-16 lg:py-12">
      <Logo variant="light" className="h-14" />

      <div className="my-auto max-w-xl py-16">
        <h1 className="text-[36px] font-bold leading-tight tracking-tight">
          Manage your assets with confidence.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-indigo-200 lg:text-lg">
          Streamline maintenance workflows, track asset lifecycles, and keep your
          operations running smoothly.
        </p>

        <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-10">
          {statLabels.map((stat) => (
            <div key={stat.key}>
              <p className="text-[30px] font-bold">
                {formatStatValue(stats ? stats[stat.key] : null)}
              </p>
              <p className="mt-1 text-sm text-indigo-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-sm text-indigo-400">
        &copy; {new Date().getFullYear()} OA Management System
      </p>
    </div>
  );
}
