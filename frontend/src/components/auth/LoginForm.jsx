import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api, { handleApiError } from '../../utils/api';
import toast from 'react-hot-toast';

const LoginForm = ({ onSuccess, registerTo = '/register', compact = false }) => {
  const { login } = useAuth();
  const [mode, setMode] = useState('login');
  const [otpSent, setOtpSent] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [resetForm, setResetForm] = useState({ email: '', otp: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState(false);
  const [showResetPw, setShowResetPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      onSuccess?.(user);
    } catch (err) {
      handleApiError(err, 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const openForgotPassword = () => {
    setMode('reset');
    setOtpSent(false);
    setShowResetPw(false);
    setResetForm({
      email: form.email || '',
      otp: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const closeForgotPassword = () => {
    setMode('login');
    setOtpSent(false);
    setShowResetPw(false);
    setResetForm((prev) => ({ ...prev, otp: '', newPassword: '', confirmPassword: '' }));
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password/request-otp', { email: resetForm.email });
      setOtpSent(true);
      toast.success('OTP sent to your email.');
    } catch (err) {
      handleApiError(err, 'Unable to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (resetForm.newPassword !== resetForm.confirmPassword) {
      toast.error('New password and confirm password must match.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/forgot-password/reset', {
        email: resetForm.email,
        otp: resetForm.otp,
        newPassword: resetForm.newPassword,
      });
      toast.success('Password reset successful. Please sign in.');
      setForm((prev) => ({ ...prev, email: resetForm.email, password: '' }));
      closeForgotPassword();
    } catch (err) {
      handleApiError(err, 'Unable to reset password');
    } finally {
      setLoading(false);
    }
  };

  const isResetMode = mode === 'reset';

  return (
    <>
      <div className={`border-b border-[#efe5d8] ${compact ? 'mb-2.5 pb-2.5 sm:mb-5 sm:pb-4' : 'mb-3 pb-3 sm:mb-5 sm:pb-4'}`}>
        {!isResetMode && (
          <p className={`${compact ? 'hidden sm:block' : 'block'} mb-1.5 text-[9px] font-semibold uppercase tracking-[0.28em] text-boho-terra/80`}>
            Member Login
          </p>
        )}
        {isResetMode && (
          <p className={`${compact ? 'hidden sm:block' : 'block'} mb-1.5 text-[9px] font-semibold uppercase tracking-[0.28em] text-boho-terra/80`}>
            Password Recovery
          </p>
        )}
        <h2 className={`mb-1 font-display leading-tight text-gray-900 ${compact ? 'text-[1.12rem] sm:text-[2rem]' : 'text-[1.25rem] sm:text-3xl'}`}>
          {isResetMode ? 'Reset your password' : 'Welcome back'}
        </h2>
        <p className={`text-gray-500 font-body ${compact ? 'text-[11px] sm:text-sm' : 'text-[12px] sm:text-sm'}`}>
          {isResetMode
            ? (otpSent ? 'Enter the OTP from your email and set a new password.' : 'Enter your email and we will send a 6-digit OTP.')
            : 'Sign in to continue shopping with BohoJazz'}
        </p>
      </div>

      {!isResetMode ? (
        <form onSubmit={handleSubmit} className={compact ? 'space-y-2.5 sm:space-y-4' : 'space-y-3 sm:space-y-4'}>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
              required
              className={`input-field rounded-xl border-[#dfd1bd] bg-[#fffcf8] px-3 text-[12px] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] placeholder:text-[#b6aa9a] sm:min-h-[44px] sm:px-4 sm:py-2.5 sm:text-sm ${compact ? 'min-h-[38px] py-1.5' : 'min-h-[40px] py-2'}`}
            />
          </div>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Enter your password"
                required
                className={`input-field rounded-xl border-[#dfd1bd] bg-[#fffcf8] px-3 pr-10 text-[12px] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] placeholder:text-[#b6aa9a] sm:min-h-[44px] sm:px-4 sm:py-2.5 sm:text-sm ${compact ? 'min-h-[38px] py-1.5' : 'min-h-[40px] py-2'}`}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-boho-terra"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className={`${compact ? 'hidden sm:flex' : 'flex'} flex-col gap-1.5 text-[11px] sm:flex-row sm:items-center sm:justify-between sm:text-sm`}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-boho-terra" />
              <span className="text-gray-600">Remember me</span>
            </label>
            <button
              type="button"
              onClick={openForgotPassword}
              className="font-medium text-left text-boho-terra hover:underline sm:text-right"
            >
              Forgot password?
            </button>
          </div>

          {compact && (
            <button
              type="button"
              onClick={openForgotPassword}
              className="text-left text-[11px] font-medium text-boho-terra hover:underline sm:hidden"
            >
              Forgot password?
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full rounded-xl flex items-center justify-center gap-2 shadow-[0_14px_30px_rgba(196,98,45,0.28)] ${compact ? 'min-h-[40px] py-1.5 text-[12px] sm:min-h-[46px] sm:py-3 sm:text-sm' : 'min-h-[42px] py-2 text-[13px] sm:min-h-[46px] sm:py-3 sm:text-sm'}`}
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      ) : (
        <form onSubmit={otpSent ? handleResetPassword : handleSendOtp} className={compact ? 'space-y-2.5 sm:space-y-4' : 'space-y-3 sm:space-y-4'}>
          <div>
            <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">Email Address</label>
            <input
              type="email"
              value={resetForm.email}
              onChange={e => setResetForm(p => ({ ...p, email: e.target.value }))}
              placeholder="you@example.com"
              required
              className={`input-field rounded-xl border-[#dfd1bd] bg-[#fffcf8] px-3 text-[12px] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] placeholder:text-[#b6aa9a] sm:min-h-[44px] sm:px-4 sm:py-2.5 sm:text-sm ${compact ? 'min-h-[38px] py-1.5' : 'min-h-[40px] py-2'}`}
            />
          </div>

          {otpSent && (
            <>
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={resetForm.otp}
                  onChange={e => setResetForm(p => ({ ...p, otp: e.target.value.replace(/\D/g, '') }))}
                  placeholder="6-digit OTP"
                  required
                  className={`input-field rounded-xl border-[#dfd1bd] bg-[#fffcf8] px-3 text-[12px] tracking-[0.3em] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] placeholder:text-[#b6aa9a] sm:min-h-[44px] sm:px-4 sm:py-2.5 sm:text-sm ${compact ? 'min-h-[38px] py-1.5' : 'min-h-[40px] py-2'}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">New Password</label>
                <div className="relative">
                  <input
                    type={showResetPw ? 'text' : 'password'}
                    value={resetForm.newPassword}
                    onChange={e => setResetForm(p => ({ ...p, newPassword: e.target.value }))}
                    placeholder="Minimum 8 characters"
                    required
                    className={`input-field rounded-xl border-[#dfd1bd] bg-[#fffcf8] px-3 pr-10 text-[12px] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] placeholder:text-[#b6aa9a] sm:min-h-[44px] sm:px-4 sm:py-2.5 sm:text-sm ${compact ? 'min-h-[38px] py-1.5' : 'min-h-[40px] py-2'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPw(!showResetPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-boho-terra"
                  >
                    {showResetPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-500">Confirm Password</label>
                <input
                  type={showResetPw ? 'text' : 'password'}
                  value={resetForm.confirmPassword}
                  onChange={e => setResetForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  placeholder="Re-enter new password"
                  required
                  className={`input-field rounded-xl border-[#dfd1bd] bg-[#fffcf8] px-3 text-[12px] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] placeholder:text-[#b6aa9a] sm:min-h-[44px] sm:px-4 sm:py-2.5 sm:text-sm ${compact ? 'min-h-[38px] py-1.5' : 'min-h-[40px] py-2'}`}
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`btn-primary w-full rounded-xl flex items-center justify-center gap-2 shadow-[0_14px_30px_rgba(196,98,45,0.28)] ${compact ? 'min-h-[40px] py-1.5 text-[12px] sm:min-h-[46px] sm:py-3 sm:text-sm' : 'min-h-[42px] py-2 text-[13px] sm:min-h-[46px] sm:py-3 sm:text-sm'}`}
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
            {loading ? (otpSent ? 'Resetting...' : 'Sending OTP...') : (otpSent ? 'Reset Password' : 'Send OTP')}
          </button>

          <div className="flex items-center justify-between gap-3 text-[11px] sm:text-sm">
            {otpSent ? (
              <button type="button" onClick={handleSendOtp} className="font-medium text-boho-terra hover:underline" disabled={loading}>
                Resend OTP
              </button>
            ) : <span />}
            <button
              type="button"
              onClick={closeForgotPassword}
              className="font-medium text-gray-500 hover:text-boho-terra hover:underline"
            >
              Back to login
            </button>
          </div>
        </form>
      )}

      {!isResetMode && (
        <>
          <div className={`${compact ? 'hidden sm:block' : 'block'} mt-3 rounded-xl border border-[#efe5d8] bg-[#fcf7ef] p-2.5 text-[10px] text-gray-500 sm:mt-4 sm:p-4 sm:text-xs`}>
            <p className="font-semibold uppercase tracking-[0.18em] text-[#9d775b]">Demo Access</p>
            <p className="mt-1"><strong>Admin:</strong> admin@bohojazz.com / Admin@123</p>
          </div>

          <p className={`text-center text-gray-500 font-body ${compact ? 'mt-2.5 text-[11px] sm:mt-5 sm:text-sm' : 'mt-3 text-[12px] sm:mt-5 sm:text-sm'}`}>
            Don't have an account?{' '}
            <Link to={registerTo} className="font-semibold text-boho-terra hover:underline">Create one</Link>
          </p>
        </>
      )}
    </>
  );
};

export default LoginForm;
