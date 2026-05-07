import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Lock, Package } from 'lucide-react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import { useAuth } from '../../context/AuthContext';
import api, { handleApiError } from '../../utils/api';
import toast from 'react-hot-toast';

const Account = () => {
  const { user, loadUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '' });
  }, [user]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      await api.put('/auth/me', form);
      await loadUser();
      toast.success('Profile updated!');
    } catch (err) { handleApiError(err); }
    finally { setSaving(false); }
  };

  const changePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) { toast.error('Passwords do not match.'); return; }
    try {
      await api.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed successfully!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { handleApiError(err); }
  };

  return (
    <div className="min-h-screen bg-boho-cream">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-display text-3xl mb-6">My Account</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="card p-5">
            <div className="flex flex-col items-center text-center mb-5">
              <div className="w-16 h-16 rounded-full bg-boho-terra text-white flex items-center justify-center text-2xl font-bold mb-2">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <p className="font-semibold text-gray-800">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
            <nav className="space-y-1">
              {[
                { label: 'My Orders', path: '/orders', icon: Package },
                { label: 'Wishlist', path: '/wishlist', icon: User },
              ].map(({ label, path, icon: Icon }) => (
                <Link key={path} to={path} className="sidebar-link">
                  <Icon size={16} />{label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2 space-y-5">
            {/* Profile */}
            <div className="card p-5">
              <h3 className="font-display text-lg mb-4">Personal Information</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone</label>
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-field" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">Email</label>
                  <input value={user?.email || ''} disabled className="input-field bg-gray-50 text-gray-400" />
                </div>
              </div>
              <button onClick={saveProfile} disabled={saving} className="btn-primary mt-4">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Password */}
            <div className="card p-5">
              <h3 className="font-display text-lg mb-4">Change Password</h3>
              <div className="space-y-3">
                {[
                  { key: 'currentPassword', placeholder: 'Current Password' },
                  { key: 'newPassword', placeholder: 'New Password' },
                  { key: 'confirmPassword', placeholder: 'Confirm New Password' },
                ].map(f => (
                  <input key={f.key} type="password" placeholder={f.placeholder}
                    value={pwForm[f.key]} onChange={e => setPwForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="input-field" />
                ))}
              </div>
              <button onClick={changePassword} className="btn-primary mt-4">Update Password</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
