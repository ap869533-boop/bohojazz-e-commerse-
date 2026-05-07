import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Archive, Search } from 'lucide-react';
import api, { formatCurrency, formatDate, handleApiError, getImageUrl } from '../../utils/api';
import toast from 'react-hot-toast';

const statusColors = {
  published: 'bg-green-100 text-green-700', pending: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700', draft: 'bg-gray-100 text-gray-600', archived: 'bg-gray-100 text-gray-500',
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter) params.set('status', statusFilter);
      const { data } = await api.get(`/admin/products?${params}`);
      setProducts(data.data || []);
      setPagination(data.pagination || {});
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/products/${id}/status`, { status });
      toast.success(`Product ${status}.`);
      fetchProducts();
    } catch (err) { handleApiError(err); }
  };

  const statusTabs = ['pending', 'published', 'rejected', 'archived', ''];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Products Management</h1>
        <span className="text-sm text-gray-500">{pagination.total || 0} products</span>
      </div>

      <div className="flex gap-2 flex-wrap">
        {statusTabs.map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${statusFilter === s ? 'bg-boho-terra text-white' : 'border border-gray-200 text-gray-600 hover:border-boho-terra'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Product', 'Vendor', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                  <th key={h} className="table-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}><td colSpan={7}><div className="h-12 bg-gray-50 animate-pulse m-2 rounded" /></td></tr>
                ))
              ) : products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.primary_image && <img src={getImageUrl(p.primary_image)} alt={p.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate max-w-[150px]">{p.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{p.uuid?.slice(0,8)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-td text-gray-600">{p.shop_name}</td>
                  <td className="table-td text-gray-500">{p.category_name || '-'}</td>
                  <td className="table-td font-medium text-boho-terra">{formatCurrency(p.sale_price || p.price)}</td>
                  <td className="table-td text-center">
                    <span className={`font-medium ${p.stock_quantity === 0 ? 'text-red-500' : 'text-gray-700'}`}>{p.stock_quantity}</span>
                  </td>
                  <td className="table-td">
                    <span className={`badge capitalize text-xs ${statusColors[p.status]}`}>{p.status}</span>
                  </td>
                  <td className="table-td">
                    <div className="flex gap-1">
                      {p.status !== 'published' && (
                        <button onClick={() => updateStatus(p.id, 'published')} title="Approve"
                          className="p-1.5 text-green-500 hover:bg-green-50 rounded-lg transition-colors">
                          <CheckCircle size={15} />
                        </button>
                      )}
                      {p.status !== 'rejected' && (
                        <button onClick={() => updateStatus(p.id, 'rejected')} title="Reject"
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <XCircle size={15} />
                        </button>
                      )}
                      <button onClick={() => updateStatus(p.id, 'archived')} title="Archive"
                        className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors">
                        <Archive size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-100 flex justify-between text-sm">
            <span className="text-gray-500">Page {page} of {pagination.pages}</span>
            <div className="flex gap-2">
              <button disabled={page===1} onClick={() => setPage(p=>p-1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40">Prev</button>
              <button disabled={page===pagination.pages} onClick={() => setPage(p=>p+1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
