import React, { useState, useEffect } from 'react';
import { Save, IndianRupee } from 'lucide-react';
import api, { handleApiError } from '../../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({});
  const [payoutAmount, setPayoutAmount] = useState('');
  const [requestingPayout, setRequestingPayout] = useState(false);

  useEffect(() => {
    api.get('/vendor/profile').then(r => {
      setProfile(r.data.data);
      const d = r.data.data;
      setForm({
        shop_name: d.shop_name || '', shop_description: d.shop_description || '',
        business_email: d.business_email || '', business_phone: d.business_phone || '',
        address: d.address || '', city: d.city || '', state: d.state || '',
        pincode: d.pincode || '', gst_number: d.gst_number || '', pan_number: d.pan_number || '',
        bank_account: d.bank_account || '', bank_name: d.bank_name || '', ifsc_code: d.ifsc_code || '',
        name: d.user?.name || '', phone: d.user?.phone || '',
      });
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/vendor/profile', form);
      toast.success('Profile updated!');
    } catch (err) { handleApiError(err); }
    finally { setSaving(false); }
  };

  const requestPayout = async () => {
    if (!payoutAmount || parseFloat(payoutAmount) < 100) { toast.error('Minimum payout is ₹100'); return; }
    setRequestingPayout(true);
    try {
      await api.post('/vendor/payout-request', { amount: parseFloat(payoutAmount) });
      toast.success('Payout request submitted!');
      setPayoutAmount('');
    } catch (err) { handleApiError(err); }
    finally { setRequestingPayout(false); }
  };

  const Field = ({ label, fKey, type = 'text', placeholder = '' }) => (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1.5">{label}</label>
      <input type={type} value={form[fKey] || ''} onChange={e => setForm(p => ({ ...p, [fKey]: e.target.value }))}
        placeholder={placeholder} className="input-field text-sm" />
    </div>
  );

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-boho-terra border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-5 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl">Shop Profile</h1>
        {profile && (
          <span className={`badge px-3 py-1 text-sm ${profile.is_approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
            {profile.is_approved ? '✓ Approved Vendor' : '⏳ Pending Approval'}
          </span>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Shop Info */}
        <div className="card p-5">
          <h3 className="font-display text-lg mb-4">Shop Information</h3>
          <div className="space-y-3">
            <Field label="Shop Name *" fKey="shop_name" />
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Shop Description</label>
              <textarea value={form.shop_description || ''} onChange={e => setForm(p => ({ ...p, shop_description: e.target.value }))}
                rows={3} placeholder="Describe your shop..." className="input-field text-sm resize-none" />
            </div>
            <Field label="Business Email" fKey="business_email" type="email" />
            <Field label="Business Phone" fKey="business_phone" />
          </div>
        </div>

        {/* Personal Info */}
        <div className="card p-5">
          <h3 className="font-display text-lg mb-4">Personal Details</h3>
          <div className="space-y-3">
            <Field label="Your Name" fKey="name" />
            <Field label="Your Phone" fKey="phone" />
            <Field label="GST Number" fKey="gst_number" placeholder="Optional" />
            <Field label="PAN Number" fKey="pan_number" placeholder="Optional" />
          </div>
        </div>

        {/* Address */}
        <div className="card p-5">
          <h3 className="font-display text-lg mb-4">Business Address</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Address</label>
              <textarea value={form.address || ''} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                rows={2} className="input-field text-sm resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="City" fKey="city" />
              <Field label="State" fKey="state" />
              <Field label="Pincode" fKey="pincode" />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="card p-5">
          <h3 className="font-display text-lg mb-4">Bank Details</h3>
          <div className="space-y-3">
            <Field label="Bank Name" fKey="bank_name" placeholder="e.g. State Bank of India" />
            <Field label="Account Number" fKey="bank_account" />
            <Field label="IFSC Code" fKey="ifsc_code" placeholder="e.g. SBIN0001234" />
          </div>
        </div>
      </div>

      <button onClick={save} disabled={saving} className="btn-primary flex items-center gap-2">
        {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
        {saving ? 'Saving...' : 'Save Profile'}
      </button>

      {/* Payout Request */}
      {profile?.is_approved && (
        <div className="card p-5 max-w-md">
          <h3 className="font-display text-lg mb-1 flex items-center gap-2"><IndianRupee size={18} className="text-boho-terra" />Request Payout</h3>
          <p className="text-xs text-gray-400 mb-4">Minimum withdrawal amount: ₹100</p>
          <div className="flex gap-3">
            <input type="number" value={payoutAmount} onChange={e => setPayoutAmount(e.target.value)}
              placeholder="Enter amount" min="100" className="input-field flex-1 text-sm" />
            <button onClick={requestPayout} disabled={requestingPayout} className="btn-primary px-5 text-sm whitespace-nowrap">
              {requestingPayout ? '...' : 'Request'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
