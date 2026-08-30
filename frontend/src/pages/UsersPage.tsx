import { useMemo, useState } from 'react';
import { users as initialUsers } from '../data/users';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { UserForm } from '../components/users/UserForm';
import {
  UserSearchFilter,
  type RoleFilter,
} from '../components/users/UserSearchFilter';
import { UserTable } from '../components/users/UserTable';
import type { User } from '../types/user';

type View = 'list' | 'form';

export function UsersPage() {
  const [view, setView] = useState<View>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userList] = useState(initialUsers);

  const filteredUsers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return userList.filter((user) => {
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;
      const matchesSearch =
        query.length === 0 ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toLowerCase().includes(query);

      return matchesRole && matchesSearch;
    });
  }, [userList, roleFilter, searchQuery]);

  const openAddForm = () => {
    setEditingUser(null);
    setView('form');
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setView('form');
  };

  const closeForm = () => {
    setEditingUser(null);
    setView('list');
  };

  return (
    <DashboardLayout pageTitle="User Management">
      {view === 'list' ? (
        <>
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                User Management
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Manage system users and their access roles
              </p>
            </div>
            <button
              type="button"
              onClick={openAddForm}
              className="btn-primary-gradient rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98]"
            >
              + Add New User
            </button>
          </div>

          <UserSearchFilter
            searchQuery={searchQuery}
            roleFilter={roleFilter}
            onSearchChange={setSearchQuery}
            onRoleFilterChange={setRoleFilter}
          />

          <UserTable users={filteredUsers} onEdit={openEditForm} />
        </>
      ) : (
        <UserForm
          user={editingUser}
          onCancel={closeForm}
          onSave={closeForm}
        />
      )}
    </DashboardLayout>
  );
}
