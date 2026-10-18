'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

import { useUser } from '@/context/UserContext';

const API  = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { login } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ nid: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const e = {};
    if (!/^\d{10}$|^\d{17}$/.test(form.nid)) e.nid = 'Enter a valid 10 or 17-digit NID number.';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setErrors({});
    setLoading(true);
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nid: form.nid, password: form.password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        login(data.user, data.token);
        toast.success(`Welcome back, ${data.user.fullName}!`);
        // Redirect based on role
        if (data.user.role === 'admin' || data.user.role === 'officer') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setServerError(data.message || 'Invalid NID or password.');
      }
    } catch {
      setServerError('Could not connect to server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="card">
        {/* Shield icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-light border-2 border-brand/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{t.welcomeBack}</h1>
          <p className="text-gray-500 text-sm mt-1">{t.loginSubtitle}</p>
        </div>

        {serverError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* NID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.nidLabel}</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"/></svg>
              </div>
              <input type="text" inputMode="numeric" placeholder={t.nidPlaceholder}
                value={form.nid} onChange={e => setForm({...form, nid: e.target.value})}
                className={`input-field pl-10 ${errors.nid ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}/>
            </div>
            {errors.nid && <p className="text-xs text-red-500 mt-1">{errors.nid}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.passwordLabel}</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
              </div>
              <input type={showPassword ? 'text' : 'password'} placeholder={t.passwordPlaceholder}
                value={form.password} onChange={e => setForm({...form, password: e.target.value})}
                className={`input-field pl-10 pr-10 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}/>
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword
                  ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                  : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Remember + Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-brand cursor-pointer"/>
              <span className="text-sm text-gray-600">{t.rememberMe}</span>
            </label>
            <Link href="/forgot-password" className="text-sm text-brand hover:text-brand-dark font-medium transition-colors">
              {t.forgotPassword}
            </Link>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="btn-primary text-base font-semibold mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading
              ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Logging in…</>
              : <>{t.loginBtn}<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></>}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200"/>
          <span className="text-xs text-gray-400 font-medium">{t.orDivider}</span>
          <div className="flex-1 h-px bg-gray-200"/>
        </div>

        <p className="text-center text-sm text-gray-600">
          {t.newUser}{' '}
          <Link href="/register" className="text-brand font-semibold hover:text-brand-dark transition-colors">{t.createAccount}</Link>
        </p>

        <div className="flex items-center justify-center gap-2 mt-6 text-xs text-gray-400">
          <svg className="w-4 h-4 text-brand/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
          {t.infoProtected}
        </div>

        {/* Demo hint */}
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-xs text-blue-600 text-center">
          Demo: NID <strong>1234567890</strong> · Password <strong>password</strong>
        </div>

        {/* Quick nav links for development */}
        <div className="mt-3 flex gap-2">
          <Link href="/dashboard"
            className="flex-1 text-center text-xs font-semibold bg-brand-light text-brand border border-brand/20 py-2 rounded-lg hover:bg-brand hover:text-white transition-colors">
            → Dashboard
          </Link>
          <Link href="/admin"
            className="flex-1 text-center text-xs font-semibold bg-gray-50 text-gray-600 border border-gray-200 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            → Admin Panel
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
}
