import React, { useState, useEffect } from 'react';
import { Search, UserCheck, UserX, Filter } from 'lucide-react';
import api, { formatDate, handleApiError } from '../../utils/api';
import toast from 'react-hot-toast';

const roleBadge = { admin: 'bg-red-100 text-red-700', vendor: 'bg-purple-100 text-purple-700', user: 'bg-blue-100 text-blue-700' };
const statusBadge = { active: 'bg-green-100 text-green-700', inactive: 'bg-gray-100 text-gray-600', banned: 'bg-red-100 text-red-700' };

const Users = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      const { data } = await api.get(`/admin/users?${params}`);
      setUsers(data.data || []);
      setPagination(data.pagination || {});
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, [page, roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/users/${id}/status`, { status });
      toast.success('User status updated.');
      fetchUsers();
    } catch (err) { handleApiError(err); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Users Management</h1>
        <span className="text-sm text-gray-500 font-body">{pagination.total || 0} total users</span>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-64">
          <input type="text" placeholder="Search by name or email..." value={search}
            onChange={e => setSearch(e.target.value)} className="input-field flex-1 text-sm" />
          <button type="submit" className="btn-primary px-4 text-sm">
            <Search size={15} />
          </button>
        </form>
        <select value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-boho-terra">
          <option value="">All Roles</option>
          <option value="user">Users</option>
          <option value="vendor">Vendors</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="table-td"><div className="h-4 bg-gray-100 rounded animate-pulse" /></td></tr>
                ))
              ) : users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="table-td">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-boho-terra text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {user.name?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="font-medium text-gray-800">{user.name}</span>
                    </div>
                  </td>
                  <td className="table-td text-gray-500">{user.email}</td>
                  <td className="table-td">
                    <span className={`badge text-xs capitalize ${roleBadge[user.role]}`}>{user.role}</span>
                  </td>
                  <td className="table-td">
                    <span className={`badge text-xs capitalize ${statusBadge[user.status]}`}>{user.status}</span>
                  </td>
                  <td className="table-td text-gray-400">{formatDate(user.created_at)}</td>
                  <td className="table-td">
                    <div className="flex gap-1">
                      {user.status !== 'active' && (
                        <button onClick={() => updateStatus(user.id, 'active')}
                          className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors" title="Activate">
                          <UserCheck size={15} />
                        </button>
                      )}
                      {user.status !== 'banned' && (
                        <button onClick={() => updateStatus(user.id, 'banned')}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Ban">
                          <UserX size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500">Page {page} of {pagination.pages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:border-boho-terra transition-colors">Prev</button>
              <button disabled={page === pagination.pages} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40 hover:border-boho-terra transition-colors">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Users;
