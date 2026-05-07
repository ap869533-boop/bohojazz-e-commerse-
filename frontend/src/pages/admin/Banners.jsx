import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import api, { handleApiError } from '../../utils/api';
import toast from 'react-hot-toast';

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', link_url: '', button_text: 'Shop Now', position: 'hero', sort_order: 0, is_active: true });

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
    try { await api.delete('/admin/banners/' + id); toast.success('Deleted.'); fetch(); } catch (err) { handleApiError(err); }
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
              {['hero','sidebar','popup','category'].map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <button onClick={create} className="btn-primary w-full mt-4 text-sm flex items-center justify-center gap-1"><Plus size={15}/>Add Banner</button>
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
                  <span className={"badge text-xs " + (b.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>{b.is_active ? 'Active' : 'Inactive'}</span>
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

export default Banners;
