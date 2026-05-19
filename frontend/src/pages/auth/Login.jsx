import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../../components/auth/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || null;

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
          <LoginForm
            registerTo="/register"
            onSuccess={(user) => {
              if (from) {
                navigate(from, { replace: true });
                return;
              }
              if (user.role === 'admin') navigate('/admin');
              else if (user.role === 'vendor') navigate('/vendor');
              else navigate('/');
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
