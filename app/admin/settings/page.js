'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const API = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';

function Toggle({ checked, onChange }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked?'bg-brand':'bg-gray-200'}`}>
      <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${checked?'left-6':'left-1'}`}/>
    </button>
  );
}

export default function AdminSettingsPage() {
  const [system,  setSystem]  = useState({
    siteName:'Nagorik Bhumi', tagline:'Land Services for a Better Bangladesh',
    supportEmail:'support@nagorikbhumi.gov.bd', supportPhone:'16789',
    maxFileSize:'10', maintenanceMode: false,
  });
  const [admins,  setAdmins]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);

  useEffect(() => {
    fetch(`${API}/users?role=admin&limit=50`)
      .then(r => r.json())
      .then(d => setAdmins(d.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const saveSettings = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600)); // replace with real API when backend settings route exists
    setSaving(false);
    setSaved(true);
    toast.success('Settings saved!');
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">System Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Configure system-wide settings and preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">

        {/* General */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            General Settings
          </h2>
          <div className="space-y-4">
            {[
              { label:'Site Name',          key:'siteName',      type:'text' },
              { label:'Tagline',            key:'tagline',       type:'text' },
              { label:'Support Email',      key:'supportEmail',  type:'email' },
              { label:'Support Phone',      key:'supportPhone',  type:'text' },
              { label:'Max File Size (MB)', key:'maxFileSize',   type:'number' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{f.label}</label>
                <input type={f.type} value={system[f.key]} onChange={e => setSystem({...system,[f.key]:e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"/>
              </div>
            ))}
            <div className="flex items-center justify-between py-2 border-t border-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-700">Maintenance Mode</p>
                <p className="text-xs text-gray-400">When on, users will see a maintenance page</p>
              </div>
              <Toggle checked={system.maintenanceMode} onChange={v => setSystem({...system,maintenanceMode:v})}/>
            </div>
          </div>
          {saved && <p className="text-xs text-green-600 mt-3 flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>Saved!</p>}
          <button onClick={saveSettings} disabled={saving}
            className="mt-4 bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-5 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60">
            {saving ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Saving…</> : 'Save Settings'}
          </button>
        </div>

        {/* Admin accounts from DB */}
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            Admin Accounts
            <span className="text-xs font-normal text-gray-400">(from database)</span>
          </h2>
          {loading ? <div className="h-20 bg-gray-100 rounded-xl animate-pulse"/> : (
            <div className="space-y-3 mb-4">
              {admins.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No admin users found in database</p>
              ) : admins.map((a,i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white font-bold text-xs">{a.fullName?.[0]||'A'}</div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{a.fullName}</p>
                      <p className="text-xs text-gray-400">{a.email || a.mobile}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${a.isActive?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{a.isActive?'Active':'Inactive'}</span>
                    <span className="text-[10px] bg-orange-50 text-orange-600 font-semibold px-2 py-0.5 rounded-full capitalize">{a.role}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button onClick={() => toast.info('Register a new user with role=admin via the Register page')}
            className="text-sm text-brand font-semibold border border-brand/30 px-4 py-2 rounded-lg hover:bg-brand-light transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Add Admin Account
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl border border-red-100 p-5">
          <h2 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
            Danger Zone
          </h2>
          <p className="text-xs text-gray-500 mb-4">These actions are permanent and cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={() => { localStorage.clear(); toast.success('Local cache cleared'); }}
              className="text-sm font-medium text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
              Clear Cache
            </button>
            <button onClick={() => toast.error('System reset requires direct database access. Contact your system administrator.')}
              className="text-sm font-medium text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
              Reset System
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
