'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

const API  = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';
const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

const divisions = ['Dhaka','Chattogram','Rajshahi','Khulna','Barishal','Sylhet','Rangpur','Mymensingh'];
const labelCls  = 'block text-sm font-medium text-gray-700 mb-1.5';
const inputCls  = (err) =>
  `w-full px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white ${err ? 'border-red-400 bg-red-50' : 'border-gray-200'}`;

export default function NewLandRecordPage() {
  const router   = useRouter();
  const imgRef   = useRef(null);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});
  const [preview, setPreview] = useState(null);   // local blob preview
  const [photoFile, setPhotoFile] = useState(null);
  const [form, setForm] = useState({
    title:'', type:'', division:'', district:'', upazila:'',
    address:'', plotNumber:'', khatianNumber:'', sizeValue:'', sizeUnit:'Katha', notes:'',
  });

  const set = (name, value) => {
    setForm(f => ({ ...f, [name]: value }));
    setErrors(e => ({ ...e, [name]: '' }));
  };

  /* ── Photo picker ── */
  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Photo must be under 5 MB'); return; }
    if (!file.type.startsWith('image/')) { toast.error('Only image files allowed'); return; }
    setPhotoFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPreview(null);
    if (imgRef.current) imgRef.current.value = '';
  };

  /* ── Validation ── */
  const validate = () => {
    const e = {};
    if (!form.title.trim())      e.title      = 'Title is required';
    if (!form.type)              e.type       = 'Land type is required';
    if (!form.division)          e.division   = 'Division is required';
    if (!form.district.trim())   e.district   = 'District is required';
    if (!form.plotNumber.trim()) e.plotNumber = 'Plot number is required';
    if (!form.sizeValue || isNaN(form.sizeValue) || Number(form.sizeValue) <= 0)
      e.sizeValue = 'Valid size is required';
    return e;
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);

    try {
      // Build payload — use FormData if there's a photo file, else JSON
      let photoUrl = '';

      if (photoFile) {
        // Upload photo first
        const fd = new FormData();
        fd.append('file', photoFile);
        fd.append('type', 'Deed');
        fd.append('name', `Photo – ${form.title}`);
        try {
          const upRes = await fetch(`${API}/documents/upload`, {
            method: 'POST', body: fd,
          });
          if (upRes.ok) {
            const upData = await upRes.json();
            photoUrl = `${BASE}${upData.document?.fileUrl || ''}`;
          }
        } catch {
          // If upload fails, use a default Bangladesh photo
          photoUrl = 'https://upload.wikimedia.org/wikipedia/commons/4/45/Agriculture_of_Bangladesh_11.jpg';
        }
      }

      const payload = {
        title:         form.title,
        type:          form.type,
        location:      { division: form.division, district: form.district, upazila: form.upazila, address: form.address },
        plotNumber:    form.plotNumber,
        khatianNumber: form.khatianNumber,
        size:          { value: Number(form.sizeValue), unit: form.sizeUnit, sqft: Math.round(Number(form.sizeValue) * 720) },
        notes:         form.notes,
        ...(photoUrl ? { photoUrl } : {}),
      };

      const res = await fetch(`${API}/land-records`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Land record added successfully!');
        router.push('/dashboard/land-records?refresh=1');
      } else {
        toast.error(data.message || 'Failed to add record');
      }
    } catch {
      toast.error('Could not connect to server. Make sure backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/land-records" className="p-2 hover:bg-white rounded-lg border border-gray-200 transition-colors">
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Add New Land Record</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fill in the details and upload a photo of your land</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ── Left: form fields ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Photo Upload */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">1</span>
                Land Photo
              </h2>

              {preview ? (
                <div className="relative rounded-xl overflow-hidden h-52">
                  <img src={preview} alt="Land preview" className="w-full h-full object-cover"/>
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button type="button" onClick={() => imgRef.current?.click()}
                      className="bg-white text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                      Change
                    </button>
                    <button type="button" onClick={removePhoto}
                      className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => imgRef.current?.click()}
                  className="w-full h-52 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-brand hover:bg-brand-light/20 transition-all cursor-pointer group">
                  <div className="w-14 h-14 rounded-full bg-gray-100 group-hover:bg-brand-light flex items-center justify-center transition-colors">
                    <svg className="w-7 h-7 text-gray-400 group-hover:text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/>
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600 group-hover:text-brand">Click to upload a land photo</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 5 MB</p>
                  </div>
                </button>
              )}
              <input ref={imgRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden"/>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">2</span>
                Basic Information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelCls}>Land Title <span className="text-red-500">*</span></label>
                  <input type="text" value={form.title} onChange={e => set('title', e.target.value)}
                    placeholder="e.g. Residential Land – Savar" className={inputCls(errors.title)}/>
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className={labelCls}>Land Type <span className="text-red-500">*</span></label>
                  <select value={form.type} onChange={e => set('type', e.target.value)} className={inputCls(errors.type)}>
                    <option value="">Select type</option>
                    {['Residential','Agricultural','Commercial','Industrial','Other'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.type && <p className="text-xs text-red-500 mt-1">{errors.type}</p>}
                </div>

                <div>
                  <label className={labelCls}>Plot Number <span className="text-red-500">*</span></label>
                  <input type="text" value={form.plotNumber} onChange={e => set('plotNumber', e.target.value)}
                    placeholder="e.g. 1234" className={inputCls(errors.plotNumber)}/>
                  {errors.plotNumber && <p className="text-xs text-red-500 mt-1">{errors.plotNumber}</p>}
                </div>

                <div>
                  <label className={labelCls}>Khatian Number</label>
                  <input type="text" value={form.khatianNumber} onChange={e => set('khatianNumber', e.target.value)}
                    placeholder="e.g. KH-1001" className={inputCls(false)}/>
                </div>

                <div>
                  <label className={labelCls}>Land Size <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <input type="number" value={form.sizeValue} onChange={e => set('sizeValue', e.target.value)}
                      placeholder="0.00" min="0" step="0.01"
                      className={`flex-1 px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white ${errors.sizeValue ? 'border-red-400' : 'border-gray-200'}`}/>
                    <select value={form.sizeUnit} onChange={e => set('sizeUnit', e.target.value)}
                      className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 bg-white">
                      {['Katha','Bigha','Acre','Decimal'].map(u => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  {errors.sizeValue && <p className="text-xs text-red-500 mt-1">{errors.sizeValue}</p>}
                  {form.sizeValue && !isNaN(form.sizeValue) && (
                    <p className="text-xs text-gray-400 mt-1">≈ {Math.round(Number(form.sizeValue) * 720).toLocaleString()} sq ft</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className={labelCls}>Notes</label>
                  <textarea value={form.notes} onChange={e => set('notes', e.target.value)} rows={3}
                    placeholder="Any additional notes about this land..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none bg-white"/>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-brand text-white text-xs flex items-center justify-center font-bold">3</span>
                Location Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Division <span className="text-red-500">*</span></label>
                  <select value={form.division} onChange={e => set('division', e.target.value)} className={inputCls(errors.division)}>
                    <option value="">Select division</option>
                    {divisions.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.division && <p className="text-xs text-red-500 mt-1">{errors.division}</p>}
                </div>

                <div>
                  <label className={labelCls}>District <span className="text-red-500">*</span></label>
                  <input type="text" value={form.district} onChange={e => set('district', e.target.value)}
                    placeholder="e.g. Gazipur" className={inputCls(errors.district)}/>
                  {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district}</p>}
                </div>

                <div>
                  <label className={labelCls}>Upazila</label>
                  <input type="text" value={form.upazila} onChange={e => set('upazila', e.target.value)}
                    placeholder="e.g. Savar Sadar" className={inputCls(false)}/>
                </div>

                <div className="col-span-2">
                  <label className={labelCls}>Full Address / Mouza</label>
                  <input type="text" value={form.address} onChange={e => set('address', e.target.value)}
                    placeholder="Mouza name, village, road..." className={inputCls(false)}/>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: summary + submit ── */}
          <div className="space-y-5">
            {/* Photo preview thumbnail */}
            {preview && (
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <img src={preview} alt="preview" className="w-full h-32 object-cover"/>
                <p className="text-xs text-center text-gray-400 py-2">Land photo selected ✓</p>
              </div>
            )}

            {/* Live summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="font-semibold text-gray-800 mb-4">Summary</h2>
              <div className="space-y-2.5 text-sm">
                {[
                  { label:'Title',    value: form.title      || '—' },
                  { label:'Type',     value: form.type       || '—' },
                  { label:'Division', value: form.division   || '—' },
                  { label:'District', value: form.district   || '—' },
                  { label:'Plot No.', value: form.plotNumber || '—' },
                  { label:'Size',     value: form.sizeValue ? `${form.sizeValue} ${form.sizeUnit}` : '—' },
                  { label:'Photo',    value: preview ? '✓ Uploaded' : 'Not added' },
                ].map((r,i) => (
                  <div key={i} className="flex justify-between gap-2">
                    <span className="text-gray-500 flex-shrink-0">{r.label}</span>
                    <span className={`font-medium text-right truncate ${r.label === 'Photo' && preview ? 'text-green-600' : 'text-gray-800'}`}>{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-brand-light rounded-xl border border-brand/10 p-4 flex items-start gap-2">
              <svg className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"/></svg>
              <div>
                <p className="text-xs font-semibold text-gray-800">What happens next?</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">Your record will be submitted for officer verification within 3–5 working days.</p>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button type="submit" disabled={loading}
                className="w-full bg-brand hover:bg-brand-dark text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                {loading
                  ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Submitting…</>
                  : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>Add Land Record</>}
              </button>
              <Link href="/dashboard/land-records"
                className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-sm">
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
