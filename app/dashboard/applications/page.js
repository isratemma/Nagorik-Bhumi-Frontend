'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const statusStyle = { Approved:'bg-green-100 text-green-700', Pending:'bg-yellow-100 text-yellow-700', 'In Review':'bg-blue-100 text-blue-700', Rejected:'bg-red-100 text-red-600' };
const statusIcon  = { Approved:'✓', Pending:'⏳', 'In Review':'🔍', Rejected:'✕' };

export default function ApplicationsPage() {
  const { t } = useLanguage();
  const { token } = useUser();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/applications?limit=100`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (res.ok) {
          setApplications(data.applications || []);
        } else {
          toast.error(data.message || 'Could not load applications');
        }
      } catch {
        toast.error('Could not connect to server. Make sure backend is running on port 5000.');
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, [token]);

  const filtered = applications.filter(a => filter === 'All' || a.status === filter);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t.myApplications}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t.appSubtitle}</p>
        </div>
        <Link href="/dashboard/applications/new"
          className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          {t.newApplication}
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_,i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 h-16 animate-pulse"/>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label: t.total,    value: applications.length,                                          color:'text-gray-800',   bg:'bg-gray-50' },
              { label: t.approved, value: applications.filter(a=>a.status==='Approved').length,         color:'text-green-600',  bg:'bg-green-50' },
              { label: t.pending,  value: applications.filter(a=>a.status==='Pending').length,          color:'text-yellow-600', bg:'bg-yellow-50' },
              { label: t.rejected, value: applications.filter(a=>a.status==='Rejected').length,         color:'text-red-600',    bg:'bg-red-50' },
            ].map((s,i)=>(
              <div key={i} className={`${s.bg} rounded-xl border border-gray-100 p-4`}>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className={`text-2xl font-bold ${s.color} mt-1`}>{s.value}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            {['All','Approved','Pending','In Review','Rejected'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${filter===f?'bg-brand text-white border-brand':'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['App ID', 'Type', 'Land Record', 'Submitted', 'Last Updated', 'Status', 'Action'].map(h=>(
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center">
                    <p className="text-sm text-gray-400">{t.noRecordsFound}</p>
                    <Link href="/dashboard/applications/new" className="text-brand text-xs font-medium hover:underline mt-1 inline-block">{t.submitNow}</Link>
                  </td></tr>
                ) : filtered.map((a,i)=>(
                  <tr key={a._id || i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-brand text-xs">{a.applicationId}</td>
                    <td className="px-4 py-3 text-gray-700 text-xs">{a.type}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {a.landRecord ? `${a.landRecord.title || a.landRecord.recordId}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(a.createdAt)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(a.reviewedAt || a.updatedAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusStyle[a.status] || 'bg-gray-100 text-gray-600'}`}>
                        {statusIcon[a.status] || ''} {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(a)}
                        className="text-xs text-brand font-medium hover:underline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Application Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">{selected.type}</h2>
                <p className="text-xs text-brand font-medium mt-0.5">{selected.applicationId}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Land Record',   value: selected.landRecord ? (selected.landRecord.title || selected.landRecord.recordId) : '—' },
                { label: 'Priority',      value: selected.priority },
                { label: t.submitted,     value: formatDate(selected.createdAt) },
                { label: t.lastUpdated,   value: formatDate(selected.reviewedAt || selected.updatedAt) },
                { label: t.status,        value: selected.status },
              ].map((row,i) => (
                <div key={i} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-500">{row.label}</span>
                  <span className="text-sm font-semibold text-gray-800">{row.value}</span>
                </div>
              ))}
              {selected.description && (
                <div className="bg-gray-50 rounded-lg p-3 mt-2">
                  <p className="text-xs text-gray-400 mb-1">Description</p>
                  <p className="text-xs text-gray-700">{selected.description}</p>
                </div>
              )}
              {selected.rejectionReason && (
                <div className="bg-red-50 rounded-lg p-3 mt-2">
                  <p className="text-xs text-red-400 mb-1">Rejection Reason</p>
                  <p className="text-xs text-red-700">{selected.rejectionReason}</p>
                </div>
              )}
            </div>
            <button onClick={() => setSelected(null)}
              className="mt-5 w-full bg-brand hover:bg-brand-dark text-white font-semibold py-2.5 rounded-lg transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
