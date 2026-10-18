'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthLayout from '@/components/AuthLayout';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { toast } from 'sonner';

const API  = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';

function EyeIcon() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>; }
function EyeOffIcon() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>; }
function LockIcon() { return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>; }

export default function RegisterPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { login } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [form, setForm] = useState({ fullName:'', nid:'', dob:'', mobile:'', password:'', confirmPassword:'' });

  const handleChange = e => setForm({...form, [e.target.name]: e.target.value});

  const validate = () => {
    const e = {};
    if (form.fullName.trim().length < 3) e.fullName = 'Full name must be at least 3 characters.';
    if (!/^\d{10}$|^\d{17}$/.test(form.nid)) e.nid = 'Enter a valid 10 or 17-digit NID number.';
    if (!form.dob) e.dob = 'Date of birth is required.';
    if (!/^01[3-9]\d{8}$/.test(form.mobile)) e.mobile = 'Enter a valid Bangladeshi mobile number (e.g. 01712345678).';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match.';
    if (!agreed) e.terms = 'You must agree to the Terms of Service and Privacy Policy.';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res  = await fetch(`${API}/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          fullName:    form.fullName,
          nid:         form.nid,
          dateOfBirth: form.dob,
          mobile:      form.mobile,
          password:    form.password,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        login(data.user, data.token);  // saves to context + localStorage
        toast.success(`Welcome to Nagorik Bhumi, ${data.user.fullName}!`);
        router.push('/dashboard');  // go to dashboard after register
      } else {
        setServerError(data.message || 'Registration failed. Please try again.');
      }
    } catch {
      setServerError('Could not connect to server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const field = (name, label, note, placeholder, type='text', icon, inputMode) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label} {note && <span className="text-gray-400 font-normal">{note}</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>
        <input type={type} name={name} placeholder={placeholder} value={form[name]}
          onChange={handleChange} inputMode={inputMode}
          className={`input-field pl-10 ${errors[name] ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}/>
      </div>
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  );

  const personIcon = <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>;
  const nidIcon   = <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"/></svg>;
  const calIcon   = <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>;
  const phoneIcon = <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 8.25h3"/></svg>;

  return (
    <AuthLayout>
      <div className="card w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-light border-2 border-brand/20 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">{t.createYourAccount}</h1>
          <p className="text-gray-500 text-sm mt-1">{t.registerSubtitle}</p>
        </div>

        {serverError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {field('fullName', t.fullNameLabel, t.fullNameNote, t.fullNamePlaceholder, 'text', personIcon)}
          {field('nid', t.nidLabel, null, t.nidPlaceholder, 'text', nidIcon, 'numeric')}
          {field('dob', t.dobLabel, null, '', 'date', calIcon)}
          {field('mobile', t.mobileLabel, null, t.mobilePlaceholder, 'tel', phoneIcon, 'tel')}

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.createPasswordLabel}</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><LockIcon/></div>
              <input type={showPassword?'text':'password'} name="password" placeholder={t.createPasswordPlaceholder}
                value={form.password} onChange={handleChange} minLength={8}
                className={`input-field pl-10 pr-10 ${errors.password?'border-red-400 focus:border-red-400 focus:ring-red-200':''}`}/>
              <button type="button" onClick={()=>setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword?<EyeOffIcon/>:<EyeIcon/>}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.confirmPasswordLabel}</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><LockIcon/></div>
              <input type={showConfirm?'text':'password'} name="confirmPassword" placeholder={t.confirmPasswordPlaceholder}
                value={form.confirmPassword} onChange={handleChange}
                className={`input-field pl-10 pr-10 ${errors.confirmPassword?'border-red-400 focus:border-red-400 focus:ring-red-200':''}`}/>
              <button type="button" onClick={()=>setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm?<EyeOffIcon/>:<EyeIcon/>}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Terms */}
          <div>
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-brand cursor-pointer flex-shrink-0"/>
              <span className="text-sm text-gray-600">
                {t.termsText}{' '}
                <Link href="/terms" className="text-brand font-medium hover:underline">{t.termsLink}</Link>
                {' '}{t.andText}{' '}
                <Link href="/privacy" className="text-brand font-medium hover:underline">{t.privacyLink}</Link>
              </span>
            </label>
            {errors.terms && <p className="text-xs text-red-500 mt-1">{errors.terms}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary text-base font-semibold mt-1 disabled:opacity-60 disabled:cursor-not-allowed">
            {loading
              ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Registering…</>
              : <>{t.registerBtn}<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></>}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          {t.alreadyAccount}{' '}
          <Link href="/login" className="text-brand font-semibold hover:text-brand-dark transition-colors">{t.loginLink}</Link>
        </p>

        <div className="flex items-start gap-2 mt-5 bg-brand-light/60 border border-brand/10 rounded-xl px-4 py-3">
          <svg className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>
          <div>
            <p className="text-xs text-gray-600 font-medium">{t.secureVerify}</p>
            <p className="text-xs text-gray-500">{t.noShareOtp}</p>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
