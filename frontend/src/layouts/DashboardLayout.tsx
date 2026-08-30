import type { ReactNode } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-page">
      <Sidebar />
      <div className="ml-60 flex min-h-screen flex-col">
        <TopBar pageTitle={pageTitle} />
        <main className="flex-1 bg-page p-8">{children}</main>
      </div>
    </div>
  );
}
