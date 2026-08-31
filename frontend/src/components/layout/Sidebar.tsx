import { useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Logo } from '../ui';
import { getCurrentUser, logoutUser, type UserRole } from '../../utils/auth';

const navItems: {
  label: string;
  icon: string;
  to: string;
  roles: UserRole[];
}[] = [
  {
    label: 'Dashboard',
    icon: '⊞',
    to: '/dashboard',
    roles: ['Admin', 'Staff', 'Technician'],
  },
  { label: 'Users', icon: '👥', to: '/users', roles: ['Admin'] },
  { label: 'Assets', icon: '🗄', to: '/assets', roles: ['Admin', 'Staff'] },
  {
    label: 'Maintenance Requests',
    icon: '🔧',
    to: '/maintenance-requests',
    roles: ['Admin', 'Staff', 'Technician'],
  },
  { label: 'Technicians', icon: '👷', to: '/technicians', roles: ['Admin'] },
  {
    label: 'Maintenance Records',
    icon: '📋',
    to: '/maintenance-records',
    roles: ['Admin', 'Staff'],
  },
];

const roleLabels: Record<UserRole, string> = {
  Admin: 'Administrator',
  Staff: 'Staff User',
  Technician: 'Technician',
};

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();
  const visibleNavItems = user
    ? navItems.filter((item) => item.roles.includes(user.role))
    : [];

  useEffect(() => {
    onClose?.();
  }, [location.pathname, onClose]);

  function handleSignOut() {
    logoutUser();
    navigate('/login', { replace: true });
  }

  return (
    <aside
      className={[
        'fixed left-0 top-0 z-50 flex h-screen w-60 flex-col bg-[#0F172A] transition-transform duration-200 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      ].join(' ')}
    >
      <div className="border-b border-white/[0.08] p-4 sm:p-5">
        <Logo variant="sidebar" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-3">
        <ul className="space-y-1">
          {visibleNavItems.map((item) => (
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
          <Avatar name={user?.name ?? 'User'} />
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-white">
              {user?.name ?? 'User'}
            </p>
            <p className="truncate text-xs text-indigo-300">
              {user ? roleLabels[user.role] : 'Signed in'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
        >
          ↩ Sign out
        </button>
      </div>
    </aside>
  );
}
