'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthLayout from '@/components/AuthLayout';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1=enter NID, 2=enter OTP, 3=new password, 4=success
  const [form, setForm] = useState({ nid: '', otp: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNID = (e) => {
    e.preventDefault();
    setError('');
    if (!/^\d{10}$|^\d{17}$/.test(form.nid)) {
      setError('Please enter a valid 10 or 17-digit NID number.');
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 1000);
  };

  const handleOTP = (e) => {
    e.preventDefault();
    setError('');
    if (form.otp.length !== 6) { setError('Please enter the 6-digit OTP.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 1000);
  };

  const handlePassword = (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(4); }, 1000);
  };

  return (
    <AuthLayout>
      <div className="card w-full max-w-sm">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1,2,3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${step > s ? 'bg-brand text-white' : step === s ? 'bg-brand text-white ring-2 ring-brand/30' : 'bg-gray-100 text-gray-400'}`}>
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className={`w-8 h-0.5 ${step > s ? 'bg-brand' : 'bg-gray-200'}`}/>}
            </div>
          ))}
        </div>

        {/* Step 1 – NID */}
        {step === 1 && (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-brand-light border-2 border-brand/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/></svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Forgot Password</h1>
              <p className="text-gray-500 text-sm mt-1">Enter your NID to receive an OTP</p>
            </div>
            <form onSubmit={handleNID} className="space-y-4">
              {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">National ID (NID) Number</label>
                <input type="text" inputMode="numeric" placeholder="Enter your 10 or 17-digit NID"
                  value={form.nid} onChange={e => setForm({...form, nid: e.target.value})}
                  className="input-field" required/>
              </div>
              <button type="submit" disabled={loading} className="btn-primary font-semibold disabled:opacity-60">
                {loading ? 'Sending OTP…' : 'Send OTP'}
              </button>
            </form>
          </>
        )}

        {/* Step 2 – OTP */}
        {step === 2 && (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-blue-50 border-2 border-blue-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3"/></svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Enter OTP</h1>
              <p className="text-gray-500 text-sm mt-1">A 6-digit OTP was sent to your registered mobile</p>
            </div>
            <form onSubmit={handleOTP} className="space-y-4">
              {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">One-Time Password (OTP)</label>
                <input type="text" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit OTP"
                  value={form.otp} onChange={e => setForm({...form, otp: e.target.value})}
                  className="input-field text-center text-2xl tracking-widest font-bold" required/>
              </div>
              <button type="submit" disabled={loading} className="btn-primary font-semibold disabled:opacity-60">
                {loading ? 'Verifying…' : 'Verify OTP'}
              </button>
              <p className="text-center text-xs text-gray-500">
                Didn't receive it?{' '}
                <button type="button" onClick={() => setStep(1)} className="text-brand font-medium hover:underline">Resend OTP</button>
              </p>
            </form>
          </>
        )}

        {/* Step 3 – New Password */}
        {step === 3 && (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-brand-light border-2 border-brand/20 flex items-center justify-center mx-auto mb-3">
                <svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800">Set New Password</h1>
              <p className="text-gray-500 text-sm mt-1">Choose a strong password</p>
            </div>
            <form onSubmit={handlePassword} className="space-y-4">
              {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
                <input type="password" placeholder="At least 8 characters" value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})} className="input-field" required minLength={8}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <input type="password" placeholder="Repeat new password" value={form.confirm}
                  onChange={e => setForm({...form, confirm: e.target.value})} className="input-field" required/>
              </div>
              <button type="submit" disabled={loading} className="btn-primary font-semibold disabled:opacity-60">
                {loading ? 'Resetting…' : 'Reset Password'}
              </button>
            </form>
          </>
        )}

        {/* Step 4 – Success */}
        {step === 4 && (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
            </div>
            <h1 className="text-xl font-bold text-gray-800">Password Reset!</h1>
            <p className="text-gray-500 text-sm mt-2 mb-6">Your password has been reset successfully.</p>
            <Link href="/login" className="btn-primary font-semibold justify-center">Back to Login</Link>
          </div>
        )}

        {step < 4 && (
          <p className="text-center text-sm text-gray-500 mt-5">
            Remember it?{' '}
            <Link href="/login" className="text-brand font-semibold hover:underline">Back to Login</Link>
          </p>
        )}
      </div>
    </AuthLayout>
  );
}
