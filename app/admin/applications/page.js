'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const API = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';

const statusStyle   = { Pending:'bg-yellow-100 text-yellow-700', 'In Review':'bg-blue-100 text-blue-700', Approved:'bg-green-100 text-green-700', Rejected:'bg-red-100 text-red-600' };
const priorityStyle = { High:'bg-red-50 text-red-500', Normal:'bg-gray-100 text-gray-600', Low:'bg-green-50 text-green-600' };

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [filter,   setFilter]   = useState('All');
  const [search,   setSearch]   = useState('');
  const [acting,   setActing]   = useState(null); // id being acted on

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/applications?limit=100`);
      const data = await res.json();
      if (res.ok) setApplications(data.applications || []);
    } catch { toast.error('Could not load applications'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchApps(); }, []);

  const review = async (id, status) => {
    setActing(id + status);
    try {
      const res  = await fetch(`${API}/applications/${id}/review`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status, notes: `${status} by admin` }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Application ${status}`);
        setApplications(prev => prev.map(a => a._id === id ? { ...a, status } : a));
      } else { toast.error(data.message || 'Action failed'); }
    } catch { toast.error('Could not connect to server'); }
    finally { setActing(null); }
  };

  const filtered = applications.filter(a =>
    (filter === 'All' || a.status === filter) &&
    (!search || (a.applicant?.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.applicationId || '').toLowerCase().includes(search.toLowerCase()))
  );

  const count = (s) => applications.filter(a => a.status === s).length;

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Pending Approvals</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review and process all land service applications</p>
        </div>
        <button onClick={() => { const csv = applications.map(a => `${a.applicationId},${a.applicant?.fullName},${a.type},${a.status}`).join('\n'); const b = new Blob([csv], {type:'text/csv'}); const u = URL.createObjectURL(b); Object.assign(document.createElement('a'), {href:u, download:'applications.csv'}).click(); toast.success('Exported!'); }}
          className="border border-brand text-brand text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-light transition-colors flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total',     value: applications.length,    color:'text-gray-800',  bg:'bg-white' },
          { label:'Pending',   value: count('Pending'),        color:'text-yellow-600',bg:'bg-yellow-50' },
          { label:'In Review', value: count('In Review'),      color:'text-blue-600',  bg:'bg-blue-50' },
          { label:'Approved',  value: count('Approved'),       color:'text-green-600', bg:'bg-green-50' },
        ].map((s,i) => (
          <div key={i} className={`${s.bg} border border-gray-100 rounded-xl p-4`}>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{loading ? '…' : s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Search applicant or ID…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"/>
        </div>
        {['All','Pending','In Review','Approved','Rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${filter===f?'bg-brand text-white border-brand':'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'}`}>{f}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['#','App ID','Applicant','NID','Type','Submitted','Priority','Status','Actions'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">No applications found</td></tr>
            ) : filtered.map((a,i) => (
              <tr key={a._id||i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400 text-xs">{i+1}</td>
                <td className="px-4 py-3 text-brand font-semibold text-xs">{a.applicationId}</td>
                <td className="px-4 py-3 font-medium text-gray-800 text-xs">{a.applicant?.fullName || '—'}</td>
                <td className="px-4 py-3 text-gray-400 text-xs font-mono">{a.applicant?.nid || '—'}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{a.type}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(a.createdAt).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</td>
                <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${priorityStyle[a.priority]||'bg-gray-100 text-gray-600'}`}>{a.priority||'Normal'}</span></td>
                <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyle[a.status]}`}>{a.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => toast.info(`${a.applicationId}: ${a.description||a.type}`)}
                      className="text-xs bg-brand text-white px-2.5 py-1 rounded-lg hover:bg-brand-dark transition-colors">View</button>
                    {(a.status==='Pending'||a.status==='In Review') && <>
                      <button disabled={acting === a._id+'Approved'}
                        onClick={() => review(a._id,'Approved')}
                        className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
                        {acting === a._id+'Approved' ? '…' : 'Approve'}
                      </button>
                      <button disabled={acting === a._id+'Rejected'}
                        onClick={() => review(a._id,'Rejected')}
                        className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50">
                        {acting === a._id+'Rejected' ? '…' : 'Reject'}
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
