'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

const API  = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';

const statusBadgeBg = {
  Verified: 'bg-green-500',
  Pending:  'bg-yellow-400',
  Rejected: 'bg-red-500',
  Draft:    'bg-gray-400',
};
const statusLabel = {
  Verified: '✓ Verified',
  Pending:  'Pending',
  Rejected: 'Rejected',
  Draft:    'Draft',
};

function LandRecordsList() {
  const params     = useSearchParams();
  const { t }      = useLanguage();
  const [records,  setRecords]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState('All');
  const [detail,   setDetail]   = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/land-records?limit=50`);
      const data = await res.json();
      if (res.ok) setRecords(data.records || []);
    } catch {
      toast.error('Could not load records from server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, [params.get('refresh')]);

  const handleDelete = async (r) => {
    try {
      const res  = await fetch(`${API}/land-records/${r._id}`, { method:'DELETE' });
      const data = await res.json();
      if (res.ok) {
        toast.success(`"${r.title}" deleted`);
        setRecords(prev => prev.filter(x => x._id !== r._id));
      } else {
        toast.error(data.message || 'Could not delete');
      }
    } catch {
      toast.error('Could not connect to server');
    } finally {
      setDeleting(null);
    }
  };

  const filtered = records.filter(r => {
    const mf = filter === 'All' || r.status === filter || r.type === filter;
    const ms = !search ||
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.district?.toLowerCase().includes(search.toLowerCase()) ||
      r.recordId?.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-full">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t.nav_landRecords}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t.adjustFilter}</p>
        </div>
        <Link href="/dashboard/land-records/new"
          className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          {t.addNewRecord}
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Search by name, location, ID..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"/>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['All','Verified','Pending','Rejected','Residential','Agricultural','Commercial'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${filter===f?'bg-brand text-white border-brand':'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_,i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-44 bg-gray-200"/>
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"/>
                <div className="h-3 bg-gray-100 rounded w-1/2"/>
                <div className="h-8 bg-gray-100 rounded mt-3"/>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
          </div>
          <h3 className="font-semibold text-gray-600 mb-1">No records found</h3>
          <p className="text-sm text-gray-400 mb-4">Try adjusting search or filters.</p>
          <Link href="/dashboard/land-records/new" className="bg-brand text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-dark transition-colors">
            Add Your First Record
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((r, i) => (
            <div key={r._id || i} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">

              {/* Photo — click for detail */}
              <div className="relative h-44 bg-gray-200 overflow-hidden cursor-pointer"
                onClick={() => setDetail(r)}>
                {r.photoUrl ? (
                  <img src={r.photoUrl} alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { e.currentTarget.style.display='none'; e.currentTarget.nextSibling.style.display='flex'; }}/>
                ) : null}
                <div className="absolute inset-0 items-center justify-center bg-gradient-to-br from-green-700 to-green-400"
                  style={{ display: r.photoUrl ? 'none' : 'flex' }}>
                  <svg className="w-12 h-12 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                </div>
                <span className={`absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadgeBg[r.status]||'bg-gray-400'}`}>
                  {statusLabel[r.status]||r.status}
                </span>
                <span className="absolute top-2 right-2 bg-black/40 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {r.type}
                </span>
                {/* Hover hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 text-gray-800 text-xs font-semibold px-3 py-1.5 rounded-full">
                    View Details
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 text-sm">{r.title}</h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  {r.location?.district}{r.location?.division?`, ${r.location.division}`:''}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="font-medium text-gray-700">{r.size?.value} {r.size?.unit}</span>
                  {r.size?.sqft?` (${Number(r.size.sqft).toLocaleString()} sq ft)`:''}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  ID: <span className="text-brand font-medium">{r.recordId}</span>
                  {r.plotNumber?<> · Plot <span className="font-medium text-gray-600">{r.plotNumber}</span></>:null}
                </p>
                <div className="flex gap-2 mt-3">
                  <Link href={`/dashboard/land-records/edit?id=${r._id}`}
                    className="flex-1 text-xs text-brand font-medium border border-brand/20 rounded-lg py-2 hover:bg-brand-light transition-colors flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  {t.editRecord}
                  </Link>
                  <button onClick={() => setDeleting(r)}
                    className="flex-1 text-xs text-red-600 font-medium border border-red-200 rounded-lg py-2 hover:bg-red-50 transition-colors flex items-center justify-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    {t.deleteRecord}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDetail(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="relative h-56 bg-gray-200">
              {detail.photoUrl ? (
                <img src={detail.photoUrl} alt={detail.title} className="w-full h-full object-cover"/>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-green-700 to-green-400 flex items-center justify-center">
                  <svg className="w-16 h-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
                </div>
              )}
              <span className={`absolute top-3 left-3 text-white text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadgeBg[detail.status]||'bg-gray-400'}`}>
                {statusLabel[detail.status]||detail.status}
              </span>
              <button onClick={() => setDetail(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h2 className="font-bold text-gray-800 text-lg">{detail.title}</h2>
                  <p className="text-xs text-brand font-medium mt-0.5">{detail.recordId}</p>
                </div>
                <span className="text-xs bg-brand-light text-brand font-semibold px-2.5 py-1 rounded-full">{detail.type}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {[
                  { label:'Location', value:`${detail.location?.district||'—'}${detail.location?.division?', '+detail.location.division:''}` },
                  { label:'Upazila',  value: detail.location?.upazila||'—' },
                  { label:'Size',     value: detail.size?`${detail.size.value} ${detail.size.unit} (${Number(detail.size.sqft||0).toLocaleString()} sq ft)`:'—' },
                  { label:'Plot No.', value: detail.plotNumber||'—' },
                  { label:'Khatian',  value: detail.khatianNumber||'—' },
                  { label:'Owner',    value: detail.owner?.fullName||'—' },
                ].map((row,i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-[10px] text-gray-400 mb-0.5">{row.label}</p>
                    <p className="text-xs font-semibold text-gray-800 truncate">{row.value}</p>
                  </div>
                ))}
              </div>
              {detail.notes && (
                <div className="bg-brand-light/50 rounded-lg p-3 mb-4">
                  <p className="text-[10px] text-gray-400 mb-1">Notes</p>
                  <p className="text-xs text-gray-600">{detail.notes}</p>
                </div>
              )}
              <div className="flex gap-2">
                <Link href={`/dashboard/land-records/edit?id=${detail._id}`}
                  onClick={() => setDetail(null)}
                  className="flex-1 bg-brand hover:bg-brand-dark text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  Edit Record
                </Link>
                <button onClick={() => { setDetail(null); setDeleting(detail); }}
                  className="px-4 border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6"/></svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleting && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setDeleting(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </div>
            <h2 className="font-bold text-gray-800 text-lg">{t.deleteConfirm}</h2>
            <p className="text-sm text-gray-500 text-center mb-1">{t.deleteQuestion}</p>
            <p className="text-sm font-semibold text-gray-800 text-center mb-2">"{deleting.title}"</p>
            <p className="text-xs text-red-500 text-center mb-5">{t.undoneWarning}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleting(null)}
                className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                {t.cancel}
              </button>
              <button onClick={() => handleDelete(deleting)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6"/></svg>
                {t.yesDelete}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function LandRecordsPage() {
  return (
    <Suspense fallback={
      <div className="p-6 bg-gray-50 min-h-full animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"/>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(6)].map((_,i) => <div key={i} className="h-64 bg-gray-200 rounded-xl"/>)}
        </div>
      </div>
    }>
      <LandRecordsList />
    </Suspense>
  );
}
