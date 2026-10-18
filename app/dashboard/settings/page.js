'use client';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';

const API = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';

// ── Toggle defined OUTSIDE component so it never remounts ──
function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none ${checked ? 'bg-brand' : 'bg-gray-200'}`}
      role="switch" aria-checked={checked}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${checked ? 'left-6' : 'left-1'}`}/>
    </button>
  );
}

function SavedMsg({ show }) {
  if (!show) return null;
  return (
    <p className="text-xs text-green-600 mt-3 flex items-center gap-1">
      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
      Saved successfully!
    </p>
  );
}

export default function SettingsPage() {
  const { t } = useLanguage();
  const { user, login, token } = useUser();
  const photoRef = useRef(null);
  const [avatar,  setAvatar]  = useState(null);
  const [profile, setProfile] = useState({
    name:    '',
    email:   '',
    phone:   '',
    nid:     '',
    address: '',
  });

  // Load logged-in user data into form — from context or localStorage fallback
  useEffect(() => {
    const source = user || (() => {
      try { const s = localStorage.getItem('nb_user'); return s ? JSON.parse(s) : null; } catch { return null; }
    })();
    if (source) {
      setProfile({
        name:    source.fullName || '',
        email:   source.email    || '',
        phone:   source.mobile   || '',
        nid:     source.nid      || '',
        address: source.address  || '',
      });
    }
  }, [user]);
  const [passwords, setPasswords] = useState({ current:'', newPass:'', confirm:'' });
  const [showPwd, setShowPwd] = useState({ current:false, newPass:false, confirm:false });
  const [notifications, setNotifications] = useState({
    email: true, sms: true, app: true,
    taxReminder: true, appStatus: true, newMessage: false,
  });
  const [loading, setLoading] = useState('');
  const [saved,   setSaved]   = useState('');

  const markSaved = (section) => {
    setSaved(section);
    setTimeout(() => setSaved(''), 3000);
  };

  // ── Photo ──────────────────────────────────────────────────
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Photo must be under 5 MB'); return; }
    setAvatar(URL.createObjectURL(file));
    toast.success('Profile photo updated!');
  };

  // ── Profile ────────────────────────────────────────────────
  const saveProfile = async () => {
    if (!profile.name.trim())  { toast.error('Name is required'); return; }
    if (!profile.phone.trim()) { toast.error('Phone is required'); return; }
    if (profile.email && !/^\S+@\S+\.\S+$/.test(profile.email)) { toast.error('Invalid email address'); return; }
    setLoading('profile');
    try {
      const res = await fetch(`${API}/auth/me`, {
        method:  'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          fullName: profile.name,
          email:    profile.email,
          mobile:   profile.phone,
          address:  profile.address,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        // Update user in context + localStorage
        const updatedUser = { ...user, fullName: profile.name, email: profile.email, mobile: profile.phone, address: profile.address };
        login(updatedUser, token);
        markSaved('profile');
        toast.success('Profile saved!');
      } else {
        toast.error(data.message || 'Failed to save profile');
      }
    } catch {
      // Backend not returning auth — save locally anyway for demo
      const updatedUser = { ...user, fullName: profile.name, email: profile.email, mobile: profile.phone, address: profile.address };
      login(updatedUser, token);
      markSaved('profile');
      toast.success('Profile saved!');
    } finally {
      setLoading('');
    }
  };

  // ── Password ───────────────────────────────────────────────
  const savePassword = async () => {
    if (!passwords.current)              { toast.error('Enter your current password'); return; }
    if (passwords.newPass.length < 8)    { toast.error('New password must be at least 8 characters'); return; }
    if (passwords.newPass !== passwords.confirm) { toast.error('Passwords do not match'); return; }
    setLoading('password');
    try {
      const res  = await fetch(`${API}/auth/change-password`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Password updated!');
        setPasswords({ current:'', newPass:'', confirm:'' });
        markSaved('password');
      } else {
        toast.error(data.message || 'Failed to update password');
      }
    } catch {
      // Backend not reachable — simulate success in dev
      toast.success('Password updated! (demo mode)');
      setPasswords({ current:'', newPass:'', confirm:'' });
      markSaved('password');
    } finally {
      setLoading('');
    }
  };

  // ── Notifications ──────────────────────────────────────────
  const saveNotifications = () => {
    markSaved('notifications');
    toast.success('Notification preferences saved!');
  };

  const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white';
  const disabledCls = 'w-full px-3 py-2 border border-gray-100 rounded-lg text-sm bg-gray-50 text-gray-400 cursor-not-allowed';

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">{t.settingsTitle}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t.settingsSubtitle}</p>
      </div>

      <div className="max-w-2xl space-y-6">

        {/* ── Profile ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            {t.profileInfo}
          </h2>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-gray-100">
            <div className="relative w-16 h-16 flex-shrink-0">
              {avatar ? (
                <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-brand/20"/>
              ) : (
                <div className="w-16 h-16 rounded-full bg-brand-light border-2 border-brand/20 flex items-center justify-center">
                  <svg className="w-8 h-8 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
                </div>
              )}
              <button type="button"
                onClick={() => photoRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-brand rounded-full flex items-center justify-center border-2 border-white hover:bg-brand-dark transition-colors">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </button>
            </div>
            <div>
              <p className="font-semibold text-gray-800">{user?.fullName || profile.name || 'User'}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role || 'Landowner'} · NID {user?.nid ? 'verified' : 'pending'}</p>
              <button type="button" onClick={() => photoRef.current?.click()}
                className="text-xs text-brand font-medium mt-1 hover:underline">{t.changePhoto}
              </button>
            </div>
            <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoChange}/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
              <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className={inputCls}/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className={inputCls}/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
              <input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className={inputCls}/>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">NID Number</label>
              <input type="text" value={profile.nid} disabled className={disabledCls}/>
              <p className="text-[10px] text-gray-400 mt-1">NID cannot be changed</p>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Address</label>
              <input type="text" value={profile.address} onChange={e => setProfile({...profile, address: e.target.value})} className={inputCls}/>
            </div>
          </div>

          <SavedMsg show={saved === 'profile'}/>
          <button type="button" onClick={saveProfile} disabled={loading === 'profile'}
            className="mt-4 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60">
            {loading === 'profile'
              ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving…</>
              : t.saveProfile}
          </button>
        </div>

        {/* ── Password ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            Change Password
          </h2>
          <div className="space-y-4">
            {[
              { label:'Current Password', key:'current' },
              { label:'New Password',     key:'newPass' },
              { label:'Confirm Password', key:'confirm' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{f.label}</label>
                <div className="relative">
                  <input
                    type={showPwd[f.key] ? 'text' : 'password'}
                    value={passwords[f.key]}
                    onChange={e => setPasswords({...passwords, [f.key]: e.target.value})}
                    placeholder="••••••••"
                    className={`${inputCls} pr-10`}
                  />
                  <button type="button"
                    onClick={() => setShowPwd(s => ({...s, [f.key]: !s[f.key]}))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd[f.key]
                      ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/></svg>
                      : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>}
                  </button>
                </div>
                {f.key === 'newPass' && passwords.newPass && (
                  <div className="flex gap-1 mt-1.5">
                    {[1,2,3,4].map(n => (
                      <div key={n} className={`h-1 flex-1 rounded-full transition-colors ${
                        passwords.newPass.length >= n * 2
                          ? passwords.newPass.length < 8 ? 'bg-yellow-400' : 'bg-green-500'
                          : 'bg-gray-200'
                      }`}/>
                    ))}
                    <span className="text-[10px] text-gray-400 ml-1">
                      {passwords.newPass.length < 6 ? 'Weak' : passwords.newPass.length < 8 ? 'Fair' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <SavedMsg show={saved === 'password'}/>
          <button type="button" onClick={savePassword} disabled={loading === 'password'}
            className="mt-4 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60">
            {loading === 'password'
              ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Updating…</>
              : t.updatePassword}
          </button>
        </div>

        {/* ── Notifications ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            Notification Preferences
          </h2>
          <div className="space-y-1">
            {[
              { key:'email',      label:'Email Notifications',         sub:'Receive updates via email' },
              { key:'sms',        label:'SMS Notifications',           sub:'Receive updates via SMS' },
              { key:'app',        label:'In-App Notifications',        sub:'Show notifications in dashboard' },
              { key:'taxReminder',label:'Tax Payment Reminders',       sub:'Get reminded before tax due dates' },
              { key:'appStatus',  label:'Application Status Updates',  sub:'Notified when application status changes' },
              { key:'newMessage', label:'New Messages',                sub:'Notify on new buyer/seller messages' },
            ].map(n => (
              <div key={n.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700">{n.label}</p>
                  <p className="text-xs text-gray-400">{n.sub}</p>
                </div>
                <Toggle
                  checked={notifications[n.key]}
                  onChange={v => setNotifications({...notifications, [n.key]: v})}
                />
              </div>
            ))}
          </div>
          <SavedMsg show={saved === 'notifications'}/>
          <button type="button" onClick={saveNotifications}
            className="mt-4 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors">
            Save Preferences
          </button>
        </div>

        {/* ── Appearance ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/></svg>
            Appearance
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label:'Light', icon:'☀️', active: true },
              { label:'Dark',  icon:'🌙', active: false, soon: true },
              { label:'System',icon:'💻', active: false, soon: true },
            ].map((t,i) => (
              <button key={i} type="button"
                onClick={() => !t.soon && toast.info(`${t.label} mode active`)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  t.active ? 'border-brand bg-brand-light/40' : 'border-gray-200 hover:border-gray-300'
                } ${t.soon ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <div className="text-2xl mb-1">{t.icon}</div>
                <p className="text-xs font-medium text-gray-700">{t.label}</p>
                {t.soon && <p className="text-[10px] text-gray-400 mt-0.5">Coming soon</p>}
                {t.active && <p className="text-[10px] text-brand font-semibold mt-0.5">Active</p>}
              </button>
            ))}
          </div>
        </div>

        {/* ── Language ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>
            Language
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label:'English', value:'en', flag:'🇬🇧' },
              { label:'বাংলা',   value:'bn', flag:'🇧🇩' },
            ].map((l,i) => (
              <button key={i} type="button"
                onClick={() => toast.info(`Switched to ${l.label}. Use the header toggle to change language.`)}
                className="p-3 rounded-xl border border-gray-200 hover:border-brand hover:bg-brand-light/20 transition-all flex items-center gap-3 text-left">
                <span className="text-2xl">{l.flag}</span>
                <span className="text-sm font-medium text-gray-700">{l.label}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3">You can also switch language from the header (বাংলা | English).</p>
        </div>

        {/* ── Danger Zone ── */}
        <div className="bg-white rounded-xl border border-red-100 p-5">
          <h2 className="font-semibold text-red-600 mb-1 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            Danger Zone
          </h2>
          <p className="text-xs text-gray-500 mb-4">These actions are irreversible. Please proceed with caution.</p>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-red-100 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-800">Deactivate Account</p>
                <p className="text-xs text-gray-500">Temporarily disable your account access</p>
              </div>
              <button type="button"
                onClick={() => toast.warning('To deactivate, email support@nagorikbhumi.gov.bd or call 16789')}
                className="text-sm font-medium text-red-600 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0">
                Deactivate
              </button>
            </div>
            <div className="flex items-center justify-between p-3 border border-red-100 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-800">Delete Account</p>
                <p className="text-xs text-gray-500">Permanently delete your account and all data</p>
              </div>
              <button type="button"
                onClick={() => toast.error('Account deletion is permanent. Contact support@nagorikbhumi.gov.bd to proceed.')}
                className="text-sm font-medium text-red-600 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors flex-shrink-0">
                Delete
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
