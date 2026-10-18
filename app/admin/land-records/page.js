'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

const API = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';
const statusStyle = { Verified:'bg-green-100 text-green-700', Pending:'bg-yellow-100 text-yellow-700', Rejected:'bg-red-100 text-red-600', Draft:'bg-gray-100 text-gray-600' };
const typeColor   = { Residential:'bg-blue-50 text-blue-600', Agricultural:'bg-green-50 text-green-600', Commercial:'bg-orange-50 text-orange-500', Industrial:'bg-purple-50 text-purple-600' };

export default function AdminLandRecordsPage() {
  const [records,      setRecords]      = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter,   setTypeFilter]   = useState('All');
  const [acting,       setActing]       = useState(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/land-records?limit=100`);
      const data = await res.json();
      if (res.ok) setRecords(data.records || []);
    } catch { toast.error('Could not load records'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRecords(); }, []);

  const updateStatus = async (id, status) => {
    setActing(id + status);
    try {
      const res  = await fetch(`${API}/land-records/${id}/status`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Record ${status}`);
        setRecords(prev => prev.map(r => r._id === id ? { ...r, status } : r));
      } else { toast.error(data.message || 'Failed'); }
    } catch { toast.error('Could not connect to server'); }
    finally { setActing(null); }
  };

  const deleteRecord = async (r) => {
    if (!confirm(`Delete "${r.title}"?`)) return;
    try {
      const res  = await fetch(`${API}/land-records/${r._id}`, { method:'DELETE' });
      const data = await res.json();
      if (res.ok) { toast.success('Record deleted'); setRecords(prev => prev.filter(x => x._id !== r._id)); }
      else { toast.error(data.message || 'Failed'); }
    } catch { toast.error('Could not connect to server'); }
  };

  const filtered = records.filter(r =>
    (statusFilter==='All' || r.status===statusFilter) &&
    (typeFilter==='All'   || r.type===typeFilter) &&
    (!search || r.owner?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      r.recordId?.toLowerCase().includes(search.toLowerCase()) ||
      r.location?.district?.toLowerCase().includes(search.toLowerCase()))
  );

  const count = (s) => records.filter(r => r.status === s).length;

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">All Land Records</h1>
          <p className="text-sm text-gray-500 mt-0.5">View, verify and manage all registered land records</p>
        </div>
        <Link href="/dashboard/land-records/new"
          className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Add Record
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total',    value: records.length,       color:'text-gray-800',  bg:'bg-white' },
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

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Search by owner, ID, location…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"/>
        </div>
        {['All','Verified','Pending','Rejected'].map(f => (
          <button key={f} onClick={() => setStatusFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${statusFilter===f?'bg-brand text-white border-brand':'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'}`}>{f}</button>
        ))}
        {['All','Residential','Agricultural','Commercial'].map(f => (
          <button key={f} onClick={() => setTypeFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${typeFilter===f?'bg-brand text-white border-brand':'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'}`}>{f}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['#','Record ID','Owner','Type','Location','Size','Date','Status','Actions'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">No records found</td></tr>
            ) : filtered.map((r,i) => (
              <tr key={r._id||i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400 text-xs">{i+1}</td>
                <td className="px-4 py-3 text-brand font-semibold text-xs">{r.recordId}</td>
                <td className="px-4 py-3 font-medium text-gray-800 text-xs">{r.owner?.fullName || '—'}</td>
                <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${typeColor[r.type]||'bg-gray-100 text-gray-600'}`}>{r.type}</span></td>
                <td className="px-4 py-3 text-gray-500 text-xs">{r.location?.district}{r.location?.division?`, ${r.location.division}`:''}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{r.size?.value} {r.size?.unit}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(r.createdAt).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</td>
                <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyle[r.status]||'bg-gray-100 text-gray-600'}`}>{r.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Link href={`/dashboard/land-records/edit?id=${r._id}`}
                      className="text-xs bg-brand text-white px-2.5 py-1 rounded-lg hover:bg-brand-dark transition-colors">View</Link>
                    {r.status==='Pending' && <>
                      <button disabled={!!acting} onClick={() => updateStatus(r._id,'Verified')}
                        className="text-xs bg-green-600 text-white px-2.5 py-1 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors">
                        {acting===r._id+'Verified'?'…':'Approve'}
                      </button>
                      <button disabled={!!acting} onClick={() => updateStatus(r._id,'Rejected')}
                        className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-lg hover:bg-red-600 disabled:opacity-50 transition-colors">
                        {acting===r._id+'Rejected'?'…':'Reject'}
                      </button>
                    </>}
                    <button onClick={() => deleteRecord(r)}
                      className="text-xs text-red-500 border border-red-200 px-2.5 py-1 rounded-lg hover:bg-red-50 transition-colors">Del</button>
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
