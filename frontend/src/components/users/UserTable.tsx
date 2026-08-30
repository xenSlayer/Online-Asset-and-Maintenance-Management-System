import { Avatar } from '../ui';
import type { User } from '../../types/user';
import { UserRoleBadge } from './UserRoleBadge';
import { UserStatusBadge } from './UserStatusBadge';

interface UserTableProps {
  users: User[];
  totalCount: number;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export function UserTable({
  users,
  totalCount,
  onEdit,
  onDelete,
}: UserTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead className="border-b border-slate-200 bg-[#F8FAFC]">
            <tr>
              {['User', 'Email', 'Phone', 'Role', 'Status', 'Actions'].map(
                (header) => (
                  <th
                    key={header}
                    className="px-5 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-slate-500"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-8 text-center text-sm text-slate-400"
                >
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
              <tr
                key={user.id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={user.name} />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {user.name}
                      </p>
                      <p className="font-mono text-xs text-slate-400">
                        {user.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {user.email}
                </td>
                <td className="px-5 py-4 text-sm text-slate-600">
                  {user.phone}
                </td>
                <td className="px-5 py-4">
                  <UserRoleBadge role={user.role} />
                </td>
                <td className="px-5 py-4">
                  <UserStatusBadge status={user.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="rounded-lg bg-transparent px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(user)}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3">
        <p className="text-xs text-slate-400">
          Showing {users.length} of {totalCount} users
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            ← Prev
          </button>
          <button
            type="button"
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
