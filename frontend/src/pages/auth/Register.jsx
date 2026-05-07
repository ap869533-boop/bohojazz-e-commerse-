import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Store, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { handleApiError } from '../../utils/api';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'vendor' ? 'vendor' : 'user';

  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: defaultRole });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters.'); return; }
    setLoading(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to BohoJazz, ${user.name}!`);
      if (user.role === 'vendor') navigate('/vendor');
      else navigate('/');
    } catch (err) { handleApiError(err, 'Registration failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-boho-cream flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-boho-dark via-stone-900 to-boho-terra items-center justify-center p-12">
        <div className="text-center text-white">
          <div className="font-display text-5xl font-bold mb-2">Boho<span className="text-boho-gold">Jazz</span></div>
          <div className="text-sm tracking-[0.3em] text-white/60 uppercase mb-8">Classic · Contemporary · Fusion</div>
          <div className="space-y-4 text-left max-w-sm">
            {['Free shipping on orders above ₹999', 'Access to exclusive designer collections', 'Easy returns within 7 days', 'Secure payments'].map(item => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-boho-gold flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs">✓</span>
                </div>
                <p className="text-white/80 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-6">
            <div className="font-display text-3xl font-bold text-boho-terra">BohoJazz</div>
          </div>
          <h2 className="font-display text-3xl text-gray-900 mb-1">Create Account</h2>
          <p className="text-gray-500 font-body text-sm mb-6">Join thousands of fashion lovers</p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { value: 'user', label: 'I want to Shop', icon: User, sub: 'Buy amazing fashion' },
              { value: 'vendor', label: 'I want to Sell', icon: Store, sub: 'Start your fashion store' },
            ].map(({ value, label, icon: Icon, sub }) => (
              <button key={value} type="button" onClick={() => setForm(p => ({ ...p, role: value }))}
                className={`p-4 rounded-xl border-2 text-left transition-all ${form.role === value ? 'border-boho-terra bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                <Icon size={20} className={form.role === value ? 'text-boho-terra' : 'text-gray-400'} />
                <p className={`text-sm font-semibold mt-1.5 ${form.role === value ? 'text-boho-terra' : 'text-gray-700'}`}>{label}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Your full name" required className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com" required className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone Number</label>
              <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="+91 98765 43210" className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Min. 8 characters" required className="input-field pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" required className="accent-boho-terra mt-0.5" />
              <span className="text-xs text-gray-500">
                I agree to the <a href="#" className="text-boho-terra hover:underline">Terms of Service</a> and{' '}
                <a href="#" className="text-boho-terra hover:underline">Privacy Policy</a>
              </span>
            </label>
            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {loading ? 'Creating account...' : `Create ${form.role === 'vendor' ? 'Vendor' : ''} Account`}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 font-body mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-boho-terra font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
