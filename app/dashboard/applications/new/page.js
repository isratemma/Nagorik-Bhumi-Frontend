'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const appTypes = ['Land Mutation','Name Correction','Land Survey','Partition Deed','Ownership Transfer','Land Tax Clearance','Other'];

export default function NewApplicationPage() {
  const router = useRouter();
  const { token } = useUser();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ type:'', landId:'', description:'', priority:'Normal' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.type) e.type = 'Application type is required';
    if (!form.description.trim()) e.description = 'Please describe your request';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ type: form.type, description: form.description, priority: form.priority }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success('Application submitted successfully!');
        router.push('/dashboard/applications');
      } else {
        toast.error(data.message || 'Failed to submit');
      }
    } catch {
      toast.error('Could not connect to server');
    } finally { setLoading(false); }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/applications" className="p-2 hover:bg-white rounded-lg border border-gray-200 transition-colors">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800">New Application</h1>
          <p className="text-sm text-gray-500 mt-0.5">Submit a new land service application</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Application Type <span className="text-red-500">*</span></label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white ${errors.type ? 'border-red-400' : 'border-gray-200'}`}>
                <option value="">Select application type</option>
                {appTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Priority</label>
              <div className="flex gap-3">
                {['Low','Normal','High'].map(p => (
                  <button key={p} type="button" onClick={() => setForm({...form, priority: p})}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors ${form.priority === p ? 'bg-brand text-white border-brand' : 'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Description <span className="text-red-500">*</span></label>
              <textarea rows={5} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                placeholder="Describe your request in detail..."
                className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none ${errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}/>
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="flex-1 bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
              {loading
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Submitting…</>
                : <>Submit Application<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg></>}
            </button>
            <Link href="/dashboard/applications" className="px-6 border border-gray-200 text-gray-600 font-medium py-3 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-sm">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
