'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';
const inputCls = (err) =>
  `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white ${err ? 'border-red-400 bg-red-50' : 'border-gray-200'}`;

export default function NewInheritancePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({ property:'', deceased:'', relation:'', share:'', dod:'' });

  const set = (name, value) => {
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.property.trim()) e.property = 'Property description is required';
    if (!form.deceased.trim()) e.deceased = 'Name of deceased is required';
    if (!form.relation)        e.relation = 'Relation is required';
    if (!form.share.trim())    e.share    = 'Inheritance share is required';
    return e;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(() => {
      toast.success('Inheritance case filed! An officer will contact you within 5 working days.');
      router.push('/dashboard/inheritance');
    }, 1000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/inheritance" className="p-2 hover:bg-white rounded-lg border border-gray-200 transition-colors">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800">File New Inheritance Case</h1>
          <p className="text-sm text-gray-500 mt-0.5">Submit an inheritance or succession claim</p>
        </div>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">

            {/* Property */}
            <div>
              <label className={labelCls}>Property Description <span className="text-red-500">*</span></label>
              <input type="text" value={form.property} onChange={e => set('property', e.target.value)}
                placeholder="e.g. Residential Land – Savar, Dhaka"
                className={inputCls(errors.property)}/>
              {errors.property && <p className="text-xs text-red-500 mt-1">{errors.property}</p>}
            </div>

            {/* Deceased */}
            <div>
              <label className={labelCls}>Name of Deceased <span className="text-red-500">*</span></label>
              <input type="text" value={form.deceased} onChange={e => set('deceased', e.target.value)}
                placeholder="Full name as on NID"
                className={inputCls(errors.deceased)}/>
              {errors.deceased && <p className="text-xs text-red-500 mt-1">{errors.deceased}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Relation */}
              <div>
                <label className={labelCls}>Your Relation <span className="text-red-500">*</span></label>
                <select value={form.relation} onChange={e => set('relation', e.target.value)}
                  className={inputCls(errors.relation)}>
                  <option value="">Select relation</option>
                  {['Son','Daughter','Father','Mother','Spouse','Brother','Sister','Uncle','Aunt','Other'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                {errors.relation && <p className="text-xs text-red-500 mt-1">{errors.relation}</p>}
              </div>

              {/* Share */}
              <div>
                <label className={labelCls}>Your Share (%) <span className="text-red-500">*</span></label>
                <input type="text" value={form.share} onChange={e => set('share', e.target.value)}
                  placeholder="e.g. 25%"
                  className={inputCls(errors.share)}/>
                {errors.share && <p className="text-xs text-red-500 mt-1">{errors.share}</p>}
              </div>
            </div>

            {/* Date of death */}
            <div>
              <label className={labelCls}>Date of Death</label>
              <input type="date" value={form.dod} onChange={e => set('dod', e.target.value)}
                className={inputCls(false)}/>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800">
            <strong>Required documents:</strong> Death certificate, NID copies of all heirs, original land deed, succession certificate.
            Upload these in the <Link href="/dashboard/documents" className="underline font-medium">Documents</Link> section after filing.
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="flex-1 bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
              {loading
                ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Filing…</>
                : 'File Inheritance Case'}
            </button>
            <Link href="/dashboard/inheritance"
              className="px-6 border border-gray-200 text-gray-600 font-medium py-3 rounded-lg flex items-center justify-center hover:bg-gray-50 text-sm">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
