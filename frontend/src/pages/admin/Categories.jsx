import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import api, { handleApiError } from '../../utils/api';
import toast from 'react-hot-toast';

// =================== CATEGORIES ===================
export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', sort_order: 0, is_active: true });
  const [editing, setEditing] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try { const { data } = await api.get('/categories'); setCategories(data.data || []); } catch {}
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const save = async () => {
    try {
      if (editing) {
        await api.put(`/admin/categories/${editing}`, form);
        toast.success('Category updated.');
      } else {
        await api.post('/admin/categories', form);
        toast.success('Category created.');
      }
      setForm({ name: '', description: '', sort_order: 0, is_active: true });
      setEditing(null);
      fetch();
    } catch (err) { handleApiError(err); }
  };

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl">Categories</h1>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-5">
          <h3 className="font-display text-lg mb-4">{editing ? 'Edit Category' : 'Add Category'}</h3>
          <div className="space-y-3">
            <input placeholder="Category name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field text-sm" />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} className="input-field text-sm resize-none h-20" />
            <input type="number" placeholder="Sort order" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} className="input-field text-sm" />
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))} className="accent-boho-terra" /> Active</label>
          </div>
          <div className="flex gap-2 mt-4">
            {editing && <button onClick={() => { setEditing(null); setForm({ name: '', description: '', sort_order: 0, is_active: true }); }} className="btn-outline flex-1 text-sm"><X size={15} /></button>}
            <button onClick={save} className="btn-primary flex-1 text-sm flex items-center justify-center gap-1"><Save size={15} />{editing ? 'Update' : 'Create'}</button>
          </div>
        </div>
        <div className="lg:col-span-2 card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name', 'Products', 'Status', 'Order', 'Actions'].map(h => <th key={h} className="table-th">{h}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {categories.map(cat => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="table-td font-medium text-gray-800">{cat.name}</td>
                  <td className="table-td text-center text-gray-500">{cat.product_count}</td>
                  <td className="table-td"><span className={`badge text-xs ${cat.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{cat.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td className="table-td text-center text-gray-400">{cat.sort_order}</td>
                  <td className="table-td">
                    <button onClick={() => { setEditing(cat.id); setForm({ name: cat.name, description: cat.description || '', sort_order: cat.sort_order, is_active: !!cat.is_active }); }}
                      className="p-1.5 text-boho-terra hover:bg-primary-50 rounded-lg"><Edit2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// =================== SETTINGS ===================
export const Settings = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/settings').then(r => setSettings(r.data.data || {})).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/admin/settings', settings);
      toast.success('Settings saved!');
    } catch (err) { handleApiError(err); }
    finally { setSaving(false); }
  };

  const settingsConfig = [
    { key: 'site_name', label: 'Site Name', type: 'text' },
    { key: 'site_tagline', label: 'Site Tagline', type: 'text' },
    { key: 'site_email', label: 'Contact Email', type: 'email' },
    { key: 'site_phone', label: 'Contact Phone', type: 'text' },
    { key: 'default_commission', label: 'Default Commission (%)', type: 'number' },
    { key: 'free_shipping_above', label: 'Free Shipping Above (₹)', type: 'number' },
    { key: 'shipping_charge', label: 'Shipping Charge (₹)', type: 'number' },
    { key: 'currency', label: 'Currency Code', type: 'text' },
    { key: 'currency_symbol', label: 'Currency Symbol', type: 'text' },
  ];

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl">Site Settings</h1>
      <div className="card p-6 max-w-2xl">
        {loading ? <div className="animate-pulse space-y-4">{[1,2,3,4].map(i => <div key={i} className="h-10 bg-gray-100 rounded" />)}</div> : (
          <div className="grid sm:grid-cols-2 gap-4">
            {settingsConfig.map(({ key, label, type }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
                <input type={type} value={settings[key] || ''}
                  onChange={e => setSettings(p => ({ ...p, [key]: e.target.value }))}
                  className="input-field text-sm" />
              </div>
            ))}
          </div>
        )}
        <button onClick={save} disabled={saving} className="btn-primary mt-5 flex items-center gap-2">
          {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

// =================== PAYOUTS ===================
export const Payouts = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/admin/payouts${filter ? `?status=${filter}` : ''}`);
      setPayouts(data.data || []);
    } catch {}
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPayouts(); }, [filter]);

  const updatePayout = async (id, status, txId) => {
    try {
      await api.put(`/admin/payouts/${id}`, { status, transaction_id: txId });
      toast.success('Payout updated.');
      fetchPayouts();
    } catch (err) { handleApiError(err); }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl">Vendor Payouts</h1>
      <div className="flex gap-2">
        {['pending','processing','paid','failed',''].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${filter === s ? 'bg-boho-terra text-white' : 'border border-gray-200 text-gray-600 hover:border-boho-terra'}`}>
            {s || 'All'}
          </button>
        ))}
      </div>
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['Vendor', 'Amount', 'Payment Info', 'Status', 'Requested', 'Actions'].map(h => <th key={h} className="table-th">{h}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? Array.from({length:5}).map((_, i) => <tr key={i}><td colSpan={6}><div className="h-10 bg-gray-50 animate-pulse m-2 rounded" /></td></tr>) :
            payouts.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="table-td"><div><p className="font-medium text-gray-800">{p.shop_name}</p><p className="text-xs text-gray-400">{p.owner_name}</p></div></td>
                <td className="table-td font-semibold text-boho-terra">₹{p.amount}</td>
                <td className="table-td text-xs text-gray-500">{p.notes}</td>
                <td className="table-td"><span className={`badge text-xs capitalize ${p.status === 'paid' ? 'bg-green-100 text-green-700' : p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>{p.status}</span></td>
                <td className="table-td text-gray-400 text-xs">{new Date(p.requested_at).toLocaleDateString()}</td>
                <td className="table-td">
                  {p.status === 'pending' && (
                    <button onClick={() => {
                      const txId = prompt('Enter transaction ID (optional):');
                      updatePayout(p.id, 'paid', txId);
                    }} className="text-xs bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600">Mark Paid</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// =================== BANNERS ===================
export const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', link_url: '', button_text: 'Shop Now', position: 'hero', sort_order: 0, is_active: true });
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    try { const { data } = await api.get('/admin/banners'); setBanners(data.data || []); } catch {}
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const create = async () => {
    try { await api.post('/admin/banners', form); toast.success('Banner created.'); fetch(); setForm({ title: '', subtitle: '', image: '', link_url: '', button_text: 'Shop Now', position: 'hero', sort_order: 0, is_active: true }); }
    catch (err) { handleApiError(err); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try { await api.delete(`/admin/banners/${id}`); toast.success('Deleted.'); fetch(); } catch (err) { handleApiError(err); }
  };

  return (
    <div className="space-y-5">
      <h1 className="font-display text-2xl">Banners & Sliders</h1>
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="card p-5">
          <h3 className="font-display text-lg mb-4">Add Banner</h3>
          <div className="space-y-3">
            {['title','subtitle','image','link_url','button_text'].map(k => (
              <input key={k} placeholder={k.replace('_',' ').replace(/\b\w/g,c=>c.toUpperCase())} value={form[k]} onChange={e => setForm(p => ({...p,[k]:e.target.value}))} className="input-field text-sm" />
            ))}
            <select value={form.position} onChange={e => setForm(p => ({...p,position:e.target.value}))} className="input-field text-sm">
              {['hero','sidebar','popup','category'].map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
            </select>
            <input type="number" placeholder="Sort order" value={form.sort_order} onChange={e => setForm(p => ({...p,sort_order:parseInt(e.target.value)||0}))} className="input-field text-sm" />
          </div>
          <button onClick={create} className="btn-primary w-full mt-4 text-sm flex items-center justify-center gap-1"><Plus size={15} />Add Banner</button>
        </div>
        <div className="lg:col-span-2 space-y-3">
          {loading ? <div className="animate-pulse space-y-3">{[1,2,3].map(i=><div key={i} className="h-16 bg-gray-100 rounded-xl"/>)}</div> :
          banners.length === 0 ? <div className="card p-10 text-center text-gray-400">No banners yet</div> :
          banners.map(b => (
            <div key={b.id} className="card p-4 flex items-center gap-4">
              {b.image && <img src={b.image} alt={b.title} className="w-24 h-14 object-cover rounded-lg flex-shrink-0 bg-gray-100" />}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-800">{b.title || 'No title'}</p>
                <p className="text-xs text-gray-400">{b.subtitle}</p>
                <div className="flex gap-2 mt-1">
                  <span className="badge text-xs bg-blue-100 text-blue-700 capitalize">{b.position}</span>
                  <span className={`badge text-xs ${b.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{b.is_active ? 'Active' : 'Inactive'}</span>
                </div>
              </div>
              <button onClick={() => del(b.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg flex-shrink-0"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =================== COUPONS ===================
export const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', min_order_amount: '', max_discount: '', usage_limit: '', expires_at: '' });

  const fetch = async () => {
    setLoading(true);
    try { const { data } = await api.get('/admin/coupons'); setCoupons(data.data || []); } catch {}
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const del = async (id) => {
    if (!window.confirm('Delete coupon?')) return;
    try { await api.delete(`/admin/coupons/${id}`); toast.success('Deleted.'); fetch(); } catch (err) { handleApiError(err); }
  };

  const toggle = async (id, is_active) => {
    try { await api.put(`/admin/coupons/${id}`, { is_active: !is_active }); fetch(); } catch (err) { handleApiError(err); }
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
            coupons.map(c => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="table-td font-mono font-bold text-boho-terra">{c.code}</td>
                <td className="table-td capitalize">{c.type}</td>
                <td className="table-td">{c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`}</td>
                <td className="table-td">{c.used_count}/{c.usage_limit || '∞'}</td>
                <td className="table-td text-gray-500">{c.shop_name || 'Global'}</td>
                <td className="table-td">
                  <button onClick={() => toggle(c.id, c.is_active)}
                    className={`badge text-xs cursor-pointer ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="table-td text-xs text-gray-400">{c.expires_at ? new Date(c.expires_at).toLocaleDateString() : 'Never'}</td>
                <td className="table-td">
                  <button onClick={() => del(c.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
