import React, { useState, useEffect } from 'react';
import { Plus, Tag } from 'lucide-react';
import api, { handleApiError } from '../../utils/api';
import toast from 'react-hot-toast';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: '', type: 'percentage', value: '', min_order_amount: '',
    max_discount: '', usage_limit: '', expires_at: '',
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/vendor/coupons');
      setCoupons(data.data || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, []);

  const create = async () => {
    if (!form.code || !form.value) { toast.error('Code and value are required.'); return; }
    setSaving(true);
    try {
      await api.post('/vendor/coupons', { ...form, value: parseFloat(form.value), min_order_amount: parseFloat(form.min_order_amount) || 0, max_discount: form.max_discount ? parseFloat(form.max_discount) : null, usage_limit: form.usage_limit ? parseInt(form.usage_limit) : null, expires_at: form.expires_at || null });
      toast.success('Coupon created!');
      setShowForm(false);
      setForm({ code: '', type: 'percentage', value: '', min_order_amount: '', max_discount: '', usage_limit: '', expires_at: '' });
      fetchCoupons();
    } catch (err) { handleApiError(err); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">My Coupons</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={15} /> Create Coupon
        </button>
      </div>

      {showForm && (
        <div className="card p-5 max-w-2xl">
          <h3 className="font-display text-lg mb-4">New Coupon</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Coupon Code *</label>
              <input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                placeholder="e.g. SAVE20" className="input-field text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="input-field text-sm">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Value *</label>
              <input type="number" value={form.value} onChange={e => setForm(p => ({ ...p, value: e.target.value }))}
                placeholder={form.type === 'percentage' ? 'e.g. 20' : 'e.g. 100'} className="input-field text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Min Order Amount (₹)</label>
              <input type="number" value={form.min_order_amount} onChange={e => setForm(p => ({ ...p, min_order_amount: e.target.value }))}
                placeholder="0" className="input-field text-sm" />
            </div>
            {form.type === 'percentage' && (
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1.5">Max Discount (₹)</label>
                <input type="number" value={form.max_discount} onChange={e => setForm(p => ({ ...p, max_discount: e.target.value }))}
                  placeholder="Optional cap" className="input-field text-sm" />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Usage Limit</label>
              <input type="number" value={form.usage_limit} onChange={e => setForm(p => ({ ...p, usage_limit: e.target.value }))}
                placeholder="Unlimited" className="input-field text-sm" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1.5">Expiry Date</label>
              <input type="datetime-local" value={form.expires_at} onChange={e => setForm(p => ({ ...p, expires_at: e.target.value }))}
                className="input-field text-sm" />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="btn-outline flex-1 text-sm">Cancel</button>
            <button onClick={create} disabled={saving} className="btn-primary flex-1 text-sm">
              {saving ? 'Creating...' : 'Create Coupon'}
            </button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Code', 'Type', 'Value', 'Min Order', 'Used', 'Status', 'Expires'].map(h => <th key={h} className="table-th">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? Array.from({length:4}).map((_,i) => <tr key={i}><td colSpan={7}><div className="h-10 bg-gray-50 animate-pulse m-2 rounded"/></td></tr>) :
            coupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center">
                  <Tag size={36} className="text-gray-200 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">No coupons yet</p>
                </td>
              </tr>
            ) : coupons.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="table-td font-mono font-bold text-boho-terra">{c.code}</td>
                <td className="table-td capitalize text-gray-600">{c.type}</td>
                <td className="table-td font-medium">{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                <td className="table-td text-gray-500">{c.min_order_amount > 0 ? `₹${c.min_order_amount}` : 'No min'}</td>
                <td className="table-td text-gray-500">{c.used_count}/{c.usage_limit || '∞'}</td>
                <td className="table-td">
                  <span className={`badge text-xs ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="table-td text-xs text-gray-400">
                  {c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}
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
