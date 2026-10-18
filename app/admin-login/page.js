'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

const API  = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';

const inputCls = (err) =>
  `w-full pl-11 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all bg-white ${err ? 'border-red-400' : 'border-gray-200'}`;

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const [form,     setForm]     = useState({ nid: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.nid.trim())      { setError('NID is required'); return; }
    if (!form.password.trim()) { setError('Password is required'); return; }
    setLoading(true);
    try {
      const res  = await fetch(`${API}/auth/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nid: form.nid, password: form.password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (data.user.role !== 'admin' && data.user.role !== 'officer') {
          setError('Access denied. This portal is for admin and officers only.');
          return;
        }
        login(data.user, data.token);
        toast.success(`Welcome, ${data.user.fullName}!`);
        router.push('/admin');
      } else {
        setError(data.message || 'Invalid NID or password.');
      }
    } catch {
      setError('Could not connect to server. Make sure the backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', 'Hind Siliguri', sans-serif" }}>

      {/* ── Left panel — green brand side ── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col items-center justify-center overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a2a10 0%, #1a6b3c 50%, #2d8a55 100%)' }}>

        {/* Background landscape */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ backgroundImage:"url('/bg.png')", backgroundSize:'cover', backgroundPosition:'center', opacity:0.18 }}/>
          {/* Decorative leaf shapes */}
          <svg className="absolute bottom-0 left-0 w-64 opacity-15" viewBox="0 0 200 280" fill="none">
            <path d="M10 280 C10 210 50 150 25 80 C80 130 90 210 55 280Z" fill="white"/>
            <path d="M45 280 C40 205 80 135 60 55 C120 110 125 200 85 280Z" fill="white"/>
            <path d="M0 280 C5 220 25 170 15 110 C55 145 55 215 25 280Z" fill="white" opacity="0.6"/>
          </svg>
          <svg className="absolute bottom-0 right-0 w-64 opacity-15" viewBox="0 0 200 280" fill="none">
            <path d="M190 280 C190 210 150 150 175 80 C120 130 110 210 145 280Z" fill="white"/>
            <path d="M155 280 C160 205 120 135 140 55 C80 110 75 200 115 280Z" fill="white"/>
            <path d="M200 280 C195 220 175 170 185 110 C145 145 145 215 175 280Z" fill="white" opacity="0.6"/>
          </svg>
          {/* Birds */}
          <svg className="absolute top-20 left-1/4 opacity-20 w-28" viewBox="0 0 120 30" fill="none">
            <path d="M0 15 Q8 6 16 15 Q24 6 32 15" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            <path d="M50 10 Q57 3 64 10 Q71 3 78 10" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-12">
          {/* Logo */}
          <div className="w-24 h-24 bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Image src="/Logooo.png" alt="Nagorik Bhumi" width={72} height={72} style={{objectFit:'contain'}}/>
          </div>

          <h1 className="text-white text-4xl font-bold mb-2 drop-shadow-lg">নাগরিক ভূমি</h1>
          <h2 className="text-white text-2xl font-bold mb-3">Nagorik Bhumi</h2>
          <p className="text-green-200 text-sm mb-10 leading-relaxed">
            Land Services for a Better Bangladesh<br/>
            <span className="text-green-300">একটি উন্নত বাংলাদেশের জন্য ভূমি সেবা</span>
          </p>

          {/* Feature pills */}
          <div className="space-y-3 text-left max-w-xs mx-auto">
            {[
              { icon:'🗺️', text:'Manage all land records' },
              { icon:'👤', text:'User administration' },
              { icon:'📋', text:'Review & approve applications' },
              { icon:'💰', text:'Land tax management' },
              { icon:'📄', text:'Document verification' },
            ].map((f,i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/10">
                <span className="text-lg">{f.icon}</span>
                <span className="text-white/90 text-sm font-medium">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="absolute bottom-8 text-center">
          <p className="text-white/50 text-xs">Secure · Transparent · For a Better Bangladesh</p>
        </div>
      </div>

      {/* ── Right panel — login form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 justify-center mb-8 lg:hidden">
            <Image src="/Logooo.png" alt="Logo" width={40} height={40} style={{objectFit:'contain'}}/>
            <div>
              <p className="font-bold text-gray-800">Nagorik Bhumi</p>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="w-14 h-14 rounded-2xl bg-brand flex items-center justify-center mb-5 shadow-lg shadow-brand/30">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Admin Sign In</h2>
            <p className="text-gray-500 mt-1.5">Access the Nagorik Bhumi admin panel</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3.5 rounded-xl flex items-start gap-2.5">
              <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>

            {/* NID */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                NID Number
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"/></svg>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter your NID number"
                  value={form.nid}
                  onChange={e => { setForm({...form, nid: e.target.value}); setError(''); }}
                  className={inputCls(false)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => { setForm({...form, password: e.target.value}); setError(''); }}
                  className={`${inputCls(false)} pr-12`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPass
                    ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                    : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2.5 transition-all shadow-lg shadow-brand/25 hover:shadow-brand/40 disabled:opacity-60 disabled:cursor-not-allowed text-base mt-2">
              {loading
                ? <>
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    Signing in…
                  </>
                : <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
                    Sign in to Admin Panel
                  </>}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
            <p className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Demo Admin Credentials
            </p>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-700">NID:</span>
                <code className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">19901234567890000</code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-700">Password:</span>
                <code className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">password123</code>
              </div>
            </div>
          </div>

          {/* Security badge + back link */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <svg className="w-4 h-4 text-brand/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
              Secure admin access
            </div>
            <Link href="/login" className="text-xs text-brand hover:text-brand-dark font-medium transition-colors flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              Citizen Login
            </Link>
          </div>

          <p className="text-center text-gray-400 text-xs mt-8">
            © 2025 Nagorik Bhumi · All rights reserved
          </p>
        </div>
      </div>

    </div>
  );
}
