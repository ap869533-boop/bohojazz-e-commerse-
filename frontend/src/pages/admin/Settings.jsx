import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import api, { handleApiError } from '../../utils/api';
import toast from 'react-hot-toast';

const Settings = () => {
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
    { key: 'free_shipping_above', label: 'Free Shipping Above (INR)', type: 'number' },
    { key: 'shipping_charge', label: 'Shipping Charge (INR)', type: 'number' },
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

export default Settings;
