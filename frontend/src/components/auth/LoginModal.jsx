import React from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';

const LoginModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <div className="login-modal-backdrop fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-3 py-4 sm:px-4 sm:py-8">
      <div className="login-modal-panel relative flex max-h-[calc(100vh-2.5rem)] w-full max-w-[19rem] flex-col overflow-hidden rounded-[22px] border border-white/60 bg-[#fffaf4] shadow-[0_28px_90px_rgba(26,18,8,0.28)] sm:h-auto sm:max-h-[calc(100vh-4rem)] sm:max-w-[58rem] sm:rounded-[24px] lg:flex-row">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-20 rounded-full border border-white/70 bg-white/92 p-2 text-gray-600 shadow-sm backdrop-blur transition hover:bg-white hover:text-boho-terra sm:right-4 sm:top-4"
          aria-label="Close login popup"
        >
          <X size={20} />
        </button>

        <div className="relative overflow-hidden bg-[linear-gradient(135deg,#f7e5c8_0%,#d09553_52%,#5b3220_100%)] px-4 pb-2.5 pt-7 text-white sm:rounded-none sm:px-6 lg:hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.35),_transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.15))]" />
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full border border-white/15 bg-white/10" />
          <div className="relative">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/16 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-white/90 backdrop-blur">
              <Sparkles size={10} />
              BohoJazz
            </span>
            <h3 className="mt-2 max-w-[10.5rem] font-display text-[1.02rem] leading-snug">
              Sign in and continue shopping
            </h3>
            <p className="mt-1 max-w-[10.5rem] text-[10px] leading-4 text-white/80">
              Faster checkout and saved favourites.
            </p>
          </div>
        </div>

        <div className="w-full flex-1 overflow-y-auto bg-[linear-gradient(180deg,#fffaf4_0%,#fff7ee_100%)] p-2 sm:p-6 lg:w-[52%] lg:p-8">
          <div className="rounded-[18px] border border-[#eadfce] bg-white p-3 shadow-[0_18px_40px_rgba(65,42,26,0.1)] sm:rounded-[20px] sm:bg-white/90 sm:p-6 sm:backdrop-blur-sm">
            <LoginForm
              compact
              registerTo="/register"
              onSuccess={(user) => {
                onClose?.();
                if (user.role === 'admin') navigate('/admin');
                else if (user.role === 'vendor') navigate('/vendor');
                else navigate('/');
              }}
            />
          </div>
        </div>

        <div className="relative hidden min-h-[470px] flex-1 overflow-hidden bg-[linear-gradient(135deg,#f5d8ab_0%,#c98b4b_46%,#23150f_100%)] lg:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.38),_transparent_44%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(0,0,0,0.24))]" />
          <div className="absolute -left-16 top-16 h-36 w-36 rounded-full border border-white/12 bg-white/8 blur-sm" />
          <div className="absolute bottom-12 right-10 h-28 w-28 rounded-full border border-white/12 bg-black/10 blur-sm" />
          <div className="relative flex h-full flex-col justify-between p-8 text-white">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/14 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur">
                <Sparkles size={12} />
                BohoJazz
              </span>
              <h3 className="mt-5 max-w-[16rem] font-display text-[2.15rem] leading-tight text-white">
                Step into your personal style space
              </h3>
              <p className="mt-4 max-w-[18rem] text-sm leading-6 text-white/78">
                Sign in to save favourites, manage orders, and enjoy a more seamless shopping journey.
              </p>
            </div>
            <div className="space-y-4">
              <p className="font-accent text-[1.75rem] italic text-white/92">Classic. Contemporary. Fusion.</p>
              <div className="space-y-2 text-sm text-white/82">
                {[
                  'Save wishlist items across devices',
                  'Track orders and checkout faster',
                  'Access your account in one tap',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 size={15} className="text-white/90" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
