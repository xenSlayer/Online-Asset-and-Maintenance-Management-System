import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  createUser,
  deleteUser,
  fetchUsers,
  updateUser,
} from '../api/users';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { UserForm } from '../components/users/UserForm';
import {
  UserSearchFilter,
  type RoleFilter,
} from '../components/users/UserSearchFilter';
import { UserTable } from '../components/users/UserTable';
import type { User, UserRole, UserStatus } from '../types/user';

type View = 'list' | 'form';

export function UsersPage() {
  const [view, setView] = useState<View>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('All');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const loadUsers = useCallback(async () => {
    try {
      const users = await fetchUsers();
      setUserList(users);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

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
    setFormError('');
    setView('form');
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setFormError('');
    setView('form');
  };

  const closeForm = () => {
    setEditingUser(null);
    setFormError('');
    setView('list');
  };

  const handleSave = async (input: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    password?: string;
  }) => {
    setSaving(true);
    setFormError('');

    try {
      if (editingUser) {
        await updateUser(editingUser.id, input);
      } else {
        if (!input.password) {
          setFormError('Password is required for new users');
          return;
        }

        await createUser({
          ...input,
          password: input.password,
        });
      }

      await loadUsers();
      closeForm();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: User) => {
    const confirmed = window.confirm(
      `Delete ${user.name}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(user.id);
      await loadUsers();
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    }
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

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <UserSearchFilter
            searchQuery={searchQuery}
            roleFilter={roleFilter}
            onSearchChange={setSearchQuery}
            onRoleFilterChange={setRoleFilter}
          />

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              Loading users…
            </div>
          ) : (
            <UserTable
              users={filteredUsers}
              totalCount={userList.length}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          )}
        </>
      ) : (
        <UserForm
          user={editingUser}
          saving={saving}
          error={formError}
          onCancel={closeForm}
          onSave={handleSave}
        />
      )}
    </DashboardLayout>
  );
}
