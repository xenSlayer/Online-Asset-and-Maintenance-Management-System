import { NavLink } from 'react-router-dom';
import { Avatar, Logo } from '../ui';

const navItems = [
  { label: 'Dashboard', icon: '⊞', to: '/dashboard' },
  { label: 'Users', icon: '👥', to: '/users' },
  { label: 'Assets', icon: '🗄', to: '/assets' },
  { label: 'Maintenance Requests', icon: '🔧', to: '/maintenance-requests' },
  { label: 'Technicians', icon: '👷', to: '/technicians' },
  { label: 'Maintenance Records', icon: '📋', to: '/maintenance-records' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-60 flex-col bg-[#0F172A]">
      <div className="border-b border-white/[0.08] p-5">
        <Logo variant="sidebar" />
      </div>

      <nav className="flex-1 px-3 py-3">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  [
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                    isActive
                      ? 'bg-[#4F46E5] font-semibold text-white'
                      : 'text-[#94A3B8] hover:bg-white/[0.06] hover:text-white',
                  ].join(' ')
                }
              >
                <span className="text-base leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mx-3 mb-4 rounded-xl bg-white/[0.05] p-4">
        <div className="flex items-center gap-3">
          <Avatar name="Current User" />
          <div>
            <p className="text-xs font-bold text-white">Current User</p>
            <p className="text-xs text-indigo-300">Administrator</p>
          </div>
        </div>
        <button
          type="button"
          className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          ↩ Sign out
        </button>
      </div>
    </aside>
  );
}
