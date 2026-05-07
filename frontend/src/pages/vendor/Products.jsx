import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Archive, Search } from 'lucide-react';
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
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (statusFilter) params.set('status', statusFilter);
      const { data } = await api.get(`/vendor/products?${params}`);
      setProducts(data.data || []);
      setPagination(data.pagination || {});
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [page, statusFilter]);

  const archive = async (id) => {
    if (!window.confirm('Archive this product?')) return;
    try {
      await api.delete(`/vendor/products/${id}`);
      toast.success('Product archived.');
      fetchProducts();
    } catch (err) { handleApiError(err); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">My Products</h1>
        <Link to="/vendor/products/add" className="btn-primary flex items-center gap-2 text-sm"><Plus size={15} />Add Product</Link>
      </div>
      <div className="flex gap-2 flex-wrap">
        {['', 'published', 'pending', 'rejected', 'archived'].map(s => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${statusFilter === s ? 'bg-boho-terra text-white' : 'border border-gray-200 text-gray-600 hover:border-boho-terra'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Product', 'Category', 'Price', 'Stock', 'Sold', 'Status', 'Actions'].map(h => <th key={h} className="table-th">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? Array.from({length:6}).map((_,i)=><tr key={i}><td colSpan={7}><div className="h-12 bg-gray-50 animate-pulse m-2 rounded"/></td></tr>) :
              products.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.primary_image && <img src={getImageUrl(p.primary_image)} alt={p.name} className="w-full h-full object-cover"/>}
                      </div>
                      <p className="font-medium text-gray-800 truncate max-w-[140px]">{p.name}</p>
                    </div>
                  </td>
                  <td className="table-td text-gray-500">{p.category_name || '-'}</td>
                  <td className="table-td font-medium text-boho-terra">{formatCurrency(p.sale_price || p.price)}</td>
                  <td className="table-td text-center"><span className={p.stock_quantity === 0 ? 'text-red-500 font-medium' : 'text-gray-700'}>{p.stock_quantity}</span></td>
                  <td className="table-td text-center text-gray-500">{p.total_sold}</td>
                  <td className="table-td"><span className={`badge capitalize text-xs ${statusColors[p.status]}`}>{p.status}</span></td>
                  <td className="table-td">
                    <div className="flex gap-1">
                      <Link to={`/vendor/products/edit/${p.id}`} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={14}/></Link>
                      <button onClick={() => archive(p.id)} className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg"><Archive size={14}/></button>
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
              <button disabled={page===1} onClick={()=>setPage(p=>p-1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40">Prev</button>
              <button disabled={page===pagination.pages} onClick={()=>setPage(p=>p+1)} className="px-3 py-1.5 border border-gray-200 rounded-lg disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
