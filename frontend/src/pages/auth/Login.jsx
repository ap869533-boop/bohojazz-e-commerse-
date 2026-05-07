import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { handleApiError } from '../../utils/api';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const from = location.state?.from?.pathname || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      if (from) { navigate(from, { replace: true }); return; }
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'vendor') navigate('/vendor');
      else navigate('/');
    } catch (err) { handleApiError(err, 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-boho-cream flex">
      {/* Left decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-boho-terra via-amber-800 to-boho-dark items-center justify-center p-12">
        <div className="text-center text-white">
          <div className="font-display text-5xl font-bold mb-2">Boho<span className="text-boho-gold">Jazz</span></div>
          <div className="text-sm tracking-[0.3em] text-white/60 uppercase mb-8">Classic · Contemporary · Fusion</div>
          <p className="font-accent text-xl italic text-white/80 max-w-sm">
            "True style is an investment, not an impulse."
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="font-display text-3xl font-bold text-boho-terra">BohoJazz</div>
          </div>
          <h2 className="font-display text-3xl text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 font-body text-sm mb-7">Sign in to continue shopping</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                placeholder="you@example.com" required className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  placeholder="Enter your password" required className="input-field pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-boho-terra" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-boho-terra hover:underline">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 p-4 bg-primary-50 rounded-xl text-xs text-gray-500 space-y-1">
            <p><strong>Admin:</strong> admin@bohojazz.com / Admin@123</p>
          </div>

          <p className="text-center text-sm text-gray-500 font-body mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-boho-terra font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
