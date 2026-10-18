'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

const API  = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login } = useUser();
  const [form,        setForm]        = useState({ nid: '', password: '' });
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.nid || !form.password) { setError('Please enter NID and password.'); return; }
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
        setError(data.message || 'Invalid credentials.');
      }
    } catch {
      setError('Could not connect to server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-green-800 to-green-700 px-4">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute bottom-0 left-0 w-72 opacity-10" viewBox="0 0 200 260" fill="none">
          <path d="M10 260 C10 200 40 140 20 80 C70 120 80 190 50 260Z" fill="white"/>
          <path d="M40 260 C35 195 70 130 55 60 C100 105 105 185 75 260Z" fill="white"/>
        </svg>
        <svg className="absolute bottom-0 right-0 w-72 opacity-10" viewBox="0 0 200 260" fill="none">
          <path d="M190 260 C190 200 160 140 180 80 C130 120 120 190 150 260Z" fill="white"/>
          <path d="M160 260 C165 195 130 130 145 60 C100 105 95 185 125 260Z" fill="white"/>
        </svg>
      </div>

      <div className="w-full max-w-sm relative z-10">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-4 p-2">
            <Image src="/Logooo.png" alt="Nagorik Bhumi" width={64} height={64} style={{objectFit:'contain'}}/>
          </div>
          <h1 className="text-white text-2xl font-bold">Nagorik Bhumi</h1>
          <p className="text-green-200 text-sm mt-1">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Admin Login</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to access the admin panel</p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* NID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Admin NID Number</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"/></svg>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter your NID number"
                  value={form.nid}
                  onChange={e => setForm({...form, nid: e.target.value})}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
                </div>
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass
                    ? <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                    : <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60 mt-2">
              {loading
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Signing in…</>
                : <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>
                    Sign in to Admin Panel
                  </>}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 text-xs text-amber-700">
            <p className="font-semibold mb-1">Demo Admin Credentials:</p>
            <p>NID: <strong>19901234567890000</strong></p>
            <p>Password: <strong>password123</strong></p>
          </div>

          <div className="mt-4 text-center">
            <a href="/login" className="text-xs text-gray-400 hover:text-brand transition-colors">
              ← Back to Citizen Login
            </a>
          </div>
        </div>

        <p className="text-center text-green-300 text-xs mt-6">
          © 2025 Nagorik Bhumi · Secure Admin Access
        </p>
      </div>
    </div>
  );
}
