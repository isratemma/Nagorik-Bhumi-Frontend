'use client';
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

const API = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';

const statusStyle = {
  'Verified':       'bg-green-100 text-green-700',
  'Pending':        'bg-yellow-100 text-yellow-700',
  'Pending Review': 'bg-yellow-100 text-yellow-700',
  'Rejected':       'bg-red-100 text-red-600',
};
const formatColor = {
  PDF: 'bg-red-100 text-red-600',
  JPG: 'bg-blue-100 text-blue-600',
  PNG: 'bg-purple-100 text-purple-600',
};
const typeIcon = { Deed:'📄', Survey:'🗺️', Identity:'🪪', Tax:'🧾', Inheritance:'👨‍👩‍👧', Other:'📎' };
const docTypes = ['Deed','Survey','Identity','Tax','Inheritance','Other'];

export default function DocumentsPage() {
  const { t } = useLanguage();
  const [docs,     setDocs]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('All');
  const [dragging, setDragging] = useState(false);
  const [showModal,setShowModal]= useState(false);
  const [uploading,setUploading]= useState(false);
  const [selFile,  setSelFile]  = useState(null);
  const [docType,  setDocType]  = useState('Deed');
  const [docName,  setDocName]  = useState('');
  const fileRef = useRef(null);

  // ── Fetch from API ─────────────────────────────────────────
  const fetchDocs = async () => {
    try {
      const res  = await fetch(`${API}/documents`);
      const data = await res.json();
      if (res.ok) setDocs(data.documents || []);
    } catch {
      // fallback to empty — backend may not be running
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDocs(); }, []);

  // ── File selected ──────────────────────────────────────────
  const pickFile = (file) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('File must be under 10 MB'); return; }
    const allowed = ['pdf','jpg','jpeg','png'];
    const ext = file.name.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) { toast.error('Only PDF, JPG, PNG allowed'); return; }
    setSelFile(file);
    setDocName(file.name.replace(/\.[^.]+$/, '')); // strip extension as default name
    setShowModal(true);
  };

  // ── Upload ─────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!selFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', selFile);
      fd.append('type', docType);
      fd.append('name', docName || selFile.name);

      const res  = await fetch(`${API}/documents/upload`, { method:'POST', body:fd });
      const data = await res.json();

      if (res.ok) {
        toast.success(`"${docName || selFile.name}" uploaded successfully!`);
        setShowModal(false);
        setSelFile(null);
        setDocName('');
        // Add new doc to top of list
        setDocs(prev => [data.document, ...prev]);
      } else {
        toast.error(data.message || 'Upload failed');
      }
    } catch {
      toast.error('Could not connect to server. Is the backend running?');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  // ── Delete ─────────────────────────────────────────────────
  const handleDelete = async (doc) => {
    if (!confirm(`Delete "${doc.name}"?`)) return;
    try {
      const res = await fetch(`${API}/documents/${doc._id}`, { method:'DELETE' });
      if (res.ok) {
        toast.success('Document deleted');
        setDocs(prev => prev.filter(d => d._id !== doc._id));
      } else {
        const data = await res.json();
        toast.error(data.message || 'Could not delete');
      }
    } catch {
      toast.error('Could not connect to server');
    }
  };

  // ── View / Download ────────────────────────────────────────
  const viewDoc = (d) => {
    const url = d.fileUrl?.startsWith('http') ? d.fileUrl : `${API.replace('/api','')}${d.fileUrl}`;
    window.open(url, '_blank');
  };

  const downloadDoc = (d) => {
    const url = d.fileUrl?.startsWith('http') ? d.fileUrl : `${API.replace('/api','')}${d.fileUrl}`;
    const a = document.createElement('a');
    a.href = url; a.download = d.name; a.click();
    toast.success(`Downloading "${d.name}"…`);
  };

  const filtered = docs.filter(d => {
    const mf = filter === 'All' || d.type === filter || d.status === filter;
    const ms = !search || d.name?.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const fmtSize = (bytes) => bytes ? (bytes / 1024 / 1024).toFixed(1) + ' MB' : '—';
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—';

  return (
    <div className="p-6 bg-gray-50 min-h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t.documents}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t.docSubtitle}</p>
        </div>
        <button onClick={() => fileRef.current?.click()}
          className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
          Upload Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total',        value: docs.length,                                                color:'text-gray-800',  bg:'bg-white' },
          { label:'Verified',     value: docs.filter(d=>d.status==='Verified').length,               color:'text-green-600', bg:'bg-green-50' },
          { label:'Pending',      value: docs.filter(d=>d.status?.includes('Pending')).length,       color:'text-yellow-600',bg:'bg-yellow-50' },
          { label:'Rejected',     value: docs.filter(d=>d.status==='Rejected').length,               color:'text-red-600',   bg:'bg-red-50' },
        ].map((s,i) => (
          <div key={i} className={`${s.bg} border border-gray-100 rounded-xl p-4`}>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 mb-6 text-center transition-all cursor-pointer
          ${dragging ? 'border-brand bg-brand-light/50' : 'border-gray-200 bg-white hover:border-brand/40 hover:bg-brand-light/20'}`}>
        <svg className="w-8 h-8 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
        <p className="text-sm text-gray-500 font-medium">
          {t.dragDrop} <span className="text-brand hover:underline">{t.browse}</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">{t.maxSize}</p>
      </div>

      {/* Search + filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Search documents…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All','Deed','Survey','Identity','Tax','Inheritance','Verified','Pending'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors
                ${filter===f?'bg-brand text-white border-brand':'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_,i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
              <div className="flex gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"/>
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-3 bg-gray-200 rounded w-3/4"/>
                  <div className="h-3 bg-gray-100 rounded w-1/2"/>
                </div>
              </div>
              <div className="h-8 bg-gray-100 rounded mt-3"/>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="col-span-3 flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>
          </div>
          <h3 className="font-semibold text-gray-600 mb-1">{t.noDocsFound}</h3>
          <p className="text-sm text-gray-400 mb-4">{t.uploadFirst}</p>
          <button onClick={() => fileRef.current?.click()}
            className="bg-brand text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors">
            {t.uploadDocument}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((d, i) => {
            const fmt = (d.format || d.fileUrl?.split('.').pop()?.toUpperCase() || 'FILE');
            return (
              <div key={d._id || i} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl border border-gray-100">
                    {typeIcon[d.type] ?? '📎'}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${formatColor[fmt] ?? 'bg-gray-100 text-gray-600'}`}>
                      {fmt}
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-800 text-sm leading-snug truncate">{d.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{d.type}</p>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">{fmtSize(d.fileSize)} · {fmtDate(d.createdAt)}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle[d.status] || 'bg-gray-100 text-gray-500'}`}>
                    {d.status || 'Pending'}
                  </span>
                </div>

                <div className="flex gap-2 mt-3">
                  <button onClick={() => viewDoc(d)}
                    className="flex-1 text-xs text-brand font-medium border border-brand/20 rounded-lg py-1.5 hover:bg-brand-light transition-colors flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/></svg>
                    View
                  </button>
                  <button onClick={() => downloadDoc(d)}
                    className="flex-1 text-xs text-gray-600 font-medium border border-gray-200 rounded-lg py-1.5 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Download
                  </button>
                  <button onClick={() => handleDelete(d)}
                    className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
        onChange={e => { pickFile(e.target.files?.[0]); e.target.value=''; }}/>

      {/* Upload modal */}
      {showModal && selFile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => { setShowModal(false); setSelFile(null); }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>

            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">Upload Document</h2>
                <p className="text-xs text-gray-400 mt-0.5">Fill in details before uploading</p>
              </div>
              <button onClick={() => { setShowModal(false); setSelFile(null); }}
                className="p-1.5 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>

            {/* File preview */}
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-5 border border-gray-100">
              <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-xl flex-shrink-0">
                {selFile.type === 'application/pdf' ? '📄' : '🖼️'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{selFile.name}</p>
                <p className="text-xs text-gray-400">{(selFile.size/1024/1024).toFixed(2)} MB</p>
              </div>
              <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-md uppercase">
                {selFile.name.split('.').pop()}
              </span>
            </div>

            <div className="space-y-4">
              {/* Document name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Document Name</label>
                <input type="text" value={docName} onChange={e => setDocName(e.target.value)}
                  placeholder="e.g. Land Deed – LN-00123"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"/>
              </div>

              {/* Document type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Document Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {docTypes.map(t => (
                    <button key={t} type="button" onClick={() => setDocType(t)}
                      className={`py-2 rounded-lg text-xs font-medium border transition-colors ${docType===t?'bg-brand text-white border-brand':'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'}`}>
                      {typeIcon[t]} {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setSelFile(null); }}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-lg hover:bg-gray-50 text-sm">
                Cancel
              </button>
              <button onClick={handleUpload} disabled={uploading || !docName.trim()}
                className="flex-1 bg-brand hover:bg-brand-dark text-white font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60">
                {uploading
                  ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Uploading…</>
                  : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>Upload</>}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
