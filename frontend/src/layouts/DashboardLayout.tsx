import { useCallback, useState, type ReactNode } from 'react';
import { Sidebar } from '../components/layout/Sidebar';
import { TopBar } from '../components/layout/TopBar';

interface DashboardLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export function DashboardLayout({ children, pageTitle }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="min-h-screen bg-page">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div className="flex min-h-screen flex-col lg:ml-60">
        <TopBar
          pageTitle={pageTitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 bg-page p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
