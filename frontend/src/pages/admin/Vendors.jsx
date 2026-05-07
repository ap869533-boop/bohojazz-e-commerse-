import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Search } from 'lucide-react';
import api, { formatDate, handleApiError, formatCurrency } from '../../utils/api';
import toast from 'react-hot-toast';

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (filter !== '') params.set('is_approved', filter);
      if (search) params.set('search', search);
      const { data } = await api.get(`/admin/vendors?${params}`);
      setVendors(data.data || []);
      setPagination(data.pagination || {});
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchVendors(); }, [page, filter]);

  const approve = async (id, approve) => {
    try {
      await api.put(`/admin/vendors/${id}/approve`, { is_approved: approve });
      toast.success(`Vendor ${approve ? 'approved' : 'rejected'}.`);
      fetchVendors();
    } catch (err) { handleApiError(err); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Vendor Management</h1>
        <span className="text-sm text-gray-500">{pagination.total || 0} vendors</span>
      </div>

      <div className="card p-4 flex flex-wrap gap-3">
        <div className="flex gap-2 flex-1 min-w-64">
          <input type="text" placeholder="Search vendors..." value={search}
            onChange={e => setSearch(e.target.value)} className="input-field flex-1 text-sm" />
          <button onClick={() => { setPage(1); fetchVendors(); }} className="btn-primary px-4 text-sm"><Search size={15} /></button>
        </div>
        <div className="flex gap-2">
          {[{ label: 'All', value: '' }, { label: 'Pending', value: 'false' }, { label: 'Approved', value: 'true' }].map(f => (
            <button key={f.value} onClick={() => { setFilter(f.value); setPage(1); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === f.value ? 'bg-boho-terra text-white' : 'border border-gray-200 text-gray-600 hover:border-boho-terra'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Shop', 'Owner', 'Products', 'Commission', 'Status', 'Joined', 'Actions'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}><td colSpan={7}><div className="h-12 bg-gray-50 animate-pulse m-2 rounded" /></td></tr>
                ))
              ) : vendors.map(v => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="table-td">
                    <div>
                      <p className="font-medium text-gray-800">{v.shop_name}</p>
                      <p className="text-xs text-gray-400">@{v.shop_slug}</p>
                    </div>
                  </td>
                  <td className="table-td">
                    <div>
                      <p className="text-gray-700">{v.owner_name}</p>
                      <p className="text-xs text-gray-400">{v.owner_email}</p>
                    </div>
                  </td>
                  <td className="table-td text-center font-medium">{v.product_count}</td>
                  <td className="table-td text-center">{v.commission_rate}%</td>
                  <td className="table-td">
                    <span className={`badge text-xs ${v.is_approved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {v.is_approved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="table-td text-gray-400">{formatDate(v.created_at)}</td>
                  <td className="table-td">
                    <div className="flex gap-1">
                      {!v.is_approved && (
                        <button onClick={() => approve(v.id, true)} title="Approve"
                          className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                          <CheckCircle size={15} />
                        </button>
                      )}
                      {v.is_approved && (
                        <button onClick={() => approve(v.id, false)} title="Reject"
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <XCircle size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center text-sm">
            <span className="text-gray-500">Page {page} of {pagination.pages}</span>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p-1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40">Prev</button>
              <button disabled={page === pagination.pages} onClick={() => setPage(p => p+1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Vendors;
