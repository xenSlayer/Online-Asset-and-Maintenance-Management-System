import { DashboardLayout } from '../layouts/DashboardLayout';

interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <DashboardLayout>
      <h1 className="text-xl font-bold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">This section is coming soon.</p>
    </DashboardLayout>
  );
}
