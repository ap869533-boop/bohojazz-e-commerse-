import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import api, { handleApiError } from '../../utils/api';
import toast from 'react-hot-toast';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try { const { data } = await api.get('/admin/coupons'); setCoupons(data.data || []); } catch {}
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const del = async (id) => {
    if (!window.confirm('Delete coupon?')) return;
    try { await api.delete('/admin/coupons/' + id); toast.success('Deleted.'); fetch(); } catch (err) { handleApiError(err); }
  };

  const toggle = async (id, is_active) => {
    try { await api.put('/admin/coupons/' + id, { is_active: !is_active }); fetch(); } catch (err) { handleApiError(err); }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Coupons Management</h1>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Code','Type','Value','Usage','Vendor','Status','Expires','Actions'].map(h=><th key={h} className="table-th">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? Array.from({length:5}).map((_,i)=><tr key={i}><td colSpan={8}><div className="h-10 bg-gray-50 animate-pulse m-2 rounded"/></td></tr>) :
            coupons.length === 0 ? <tr><td colSpan={8} className="py-8 text-center text-gray-400">No coupons yet</td></tr> :
            coupons.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="table-td font-mono font-bold text-boho-terra">{c.code}</td>
                <td className="table-td capitalize">{c.type}</td>
                <td className="table-td">{c.type === 'percentage' ? c.value + '%' : 'Rs.' + c.value}</td>
                <td className="table-td">{c.used_count}/{c.usage_limit || '∞'}</td>
                <td className="table-td text-gray-500">{c.shop_name || 'Global'}</td>
                <td className="table-td">
                  <button onClick={() => toggle(c.id, c.is_active)}
                    className={"badge text-xs cursor-pointer " + (c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="table-td text-xs text-gray-400">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}</td>
                <td className="table-td">
                  <button onClick={() => del(c.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Coupons;
