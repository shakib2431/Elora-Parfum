import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, ArrowLeft, Database } from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signInWithSupabase, isSupabaseConnected } = useAdminAuth();
  const [email, setEmail] = useState('khanshakib0000@gmail.com');
  const [password, setPassword] = useState('elora2026!');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Preserve intended destination or default to /admin
  const from = (location.state as any)?.from?.pathname || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 1. If client Supabase is connected, attempt Supabase Auth direct sign-in first
      if (isSupabaseConnected) {
        const supabaseRes = await signInWithSupabase(email.trim(), password);
        if (supabaseRes.success) {
          navigate(from, { replace: true });
          return;
        }
      }

      // 2. Authenticate through the backend server API (which checks Supabase on server or owner key)
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.token) {
        setError(data.error || 'Authentication failed. Please verify your credentials.');
        setIsSubmitting(false);
        return;
      }

      login(data.token, data.user);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Network error connecting to administrative portal.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E12] flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-[#FAF9F6]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-[#D4AF37]/30 bg-[#14141B] text-[#D4AF37] mb-2 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
            <Lock className="w-5 h-5 stroke-[1.5]" />
          </div>
          <h2 className="font-serif text-2xl tracking-[0.12em] uppercase text-[#FFFFFF]">
            ELORA PARFUM
          </h2>
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#D4AF37] font-sans">
            Maison Atelier Management Portal
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#14141B] py-8 px-6 sm:px-10 border border-[#24232C] shadow-2xl relative">
            <div className="absolute -top-[1px] left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

            {error && (
              <div className="mb-6 p-3.5 bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-[#A1A1AA] mb-1.5 font-sans font-medium">
                  Administrator Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A1A1AA]">
                    <Mail className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#0A0A0C] border border-[#2B2A36] text-[#FFFFFF] text-xs focus:border-[#D4AF37] outline-none transition-colors"
                    placeholder="owner@eloraparfum.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.18em] text-[#A1A1AA] mb-1.5 font-sans font-medium">
                  Atelier Security Key / Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A1A1AA]">
                    <Lock className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#0A0A0C] border border-[#2B2A36] text-[#FFFFFF] text-xs focus:border-[#D4AF37] outline-none transition-colors"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#D4AF37] text-[#0A0A0C] text-xs uppercase tracking-[0.22em] font-sans font-semibold hover:bg-[#E5C378] transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 shadow-[0_4px_16px_rgba(212,175,55,0.2)]"
                >
                  <span>{isSubmitting ? 'Authenticating...' : 'Access Atelier Console'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[1.5]" />
                </button>
              </div>
            </form>

            <div className="mt-6 pt-6 border-t border-[#24232C] text-center space-y-3">
              <div className="flex items-center justify-center space-x-1.5 text-[10px] text-[#A1A1AA]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Protected by Supabase Auth & HMAC Security Protocol</span>
              </div>
              <div>
                <Link
                  to="/"
                  className="text-xs text-[#A1A1AA] hover:text-[#D4AF37] transition-colors inline-flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Public Boutique</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
