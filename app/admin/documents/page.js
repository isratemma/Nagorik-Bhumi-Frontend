'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const API = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';
const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
const statusStyle = { Verified:'bg-green-100 text-green-700', Pending:'bg-yellow-100 text-yellow-700', Rejected:'bg-red-100 text-red-600' };
const typeColor   = { Deed:'bg-blue-50 text-blue-600', Survey:'bg-purple-50 text-purple-600', Identity:'bg-orange-50 text-orange-500', Tax:'bg-brand-light text-brand', Inheritance:'bg-pink-50 text-pink-600' };

export default function AdminDocumentsPage() {
  const [docs,    setDocs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('All');
  const [acting,  setActing]  = useState(null);

  const fetchDocs = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/documents?limit=100`);
      const data = await res.json();
      if (res.ok) setDocs(data.documents || []);
    } catch { toast.error('Could not load documents'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchDocs(); }, []);

  const verify = async (id, status) => {
    setActing(id + status);
    try {
      const res  = await fetch(`${API}/documents/${id}/verify`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Document ${status}`);
        setDocs(prev => prev.map(d => d._id === id ? { ...d, status } : d));
      } else { toast.error(data.message || 'Failed'); }
    } catch { toast.error('Could not connect to server'); }
    finally { setActing(null); }
  };

  const viewDoc = (d) => {
    const url = d.fileUrl?.startsWith('http') ? d.fileUrl : `${BASE}${d.fileUrl}`;
    window.open(url, '_blank');
  };

  const filtered = docs.filter(d => filter==='All' || d.status===filter);
  const count = (s) => docs.filter(d => d.status===s).length;
  const fmtDate = (iso) => iso ? new Date(iso).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—';
  const fmtSize = (b) => b ? (b/1024/1024).toFixed(1)+' MB' : '—';

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Document Verification</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review and verify uploaded land documents</p>
        </div>
        <button onClick={fetchDocs} className="border border-brand text-brand text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-light transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total',    value: docs.length,          color:'text-gray-800',  bg:'bg-white' },
          { label:'Verified', value: count('Verified'),    color:'text-green-600', bg:'bg-green-50' },
          { label:'Pending',  value: count('Pending'),     color:'text-yellow-600',bg:'bg-yellow-50' },
          { label:'Rejected', value: count('Rejected'),    color:'text-red-600',   bg:'bg-red-50' },
        ].map((s,i) => (
          <div key={i} className={`${s.bg} border border-gray-100 rounded-xl p-4`}>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{loading ? '…' : s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {['All','Pending','Verified','Rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${filter===f?'bg-brand text-white border-brand':'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'}`}>{f}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['#','Document Name','Uploaded By','Type','Format','Size','Date','Status','Actions'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">No documents found</td></tr>
            ) : filtered.map((d,i) => (
              <tr key={d._id||i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400 text-xs">{i+1}</td>
                <td className="px-4 py-3 font-medium text-gray-800 text-xs">{d.name}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{d.uploadedBy?.fullName || '—'}</td>
                <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${typeColor[d.type]||'bg-gray-100 text-gray-600'}`}>{d.type}</span></td>
                <td className="px-4 py-3 text-gray-500 text-xs">{d.format}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{fmtSize(d.fileSize)}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{fmtDate(d.createdAt)}</td>
                <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyle[d.status]}`}>{d.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => viewDoc(d)}
                      className="text-xs bg-brand text-white px-2.5 py-1 rounded-lg hover:bg-brand-dark transition-colors">View</button>
                    {d.status==='Pending' && <>
                      <button disabled={!!acting} onClick={() => verify(d._id,'Verified')}
                        className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
                        {acting===d._id+'Verified'?'…':'Verify'}
                      </button>
                      <button disabled={!!acting} onClick={() => verify(d._id,'Rejected')}
                        className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors">
                        {acting===d._id+'Rejected'?'…':'Reject'}
                      </button>
                    </>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
