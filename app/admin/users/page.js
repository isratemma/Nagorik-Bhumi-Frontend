'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const API = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';
const statusStyle = { Active:'bg-green-100 text-green-700', Suspended:'bg-red-100 text-red-600', Inactive:'bg-gray-100 text-gray-500' };
const roleStyle   = { citizen:'bg-blue-50 text-blue-600', officer:'bg-purple-50 text-purple-600', admin:'bg-orange-50 text-orange-600' };

export default function AdminUsersPage() {
  const [users,       setUsers]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [roleFilter,  setRoleFilter]  = useState('All');
  const [statFilter,  setStatFilter]  = useState('All');
  const [acting,      setActing]      = useState(null);
  const [selected,    setSelected]    = useState(null); // user detail modal

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/users?limit=100`);
      const data = await res.json();
      if (res.ok) setUsers(data.users || []);
    } catch { toast.error('Could not load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleStatus = async (u) => {
    setActing(u._id);
    try {
      const res  = await fetch(`${API}/users/${u._id}/status`, { method:'PATCH' });
      const data = await res.json();
      if (res.ok) {
        toast.success(`User ${data.isActive ? 'activated' : 'suspended'}`);
        setUsers(prev => prev.map(x => x._id === u._id ? { ...x, isActive: data.isActive } : x));
      } else { toast.error(data.message || 'Failed'); }
    } catch { toast.error('Could not connect to server'); }
    finally { setActing(null); }
  };

  const deleteUser = async (u) => {
    if (!confirm(`Delete user "${u.fullName}"? This cannot be undone.`)) return;
    setActing(u._id + 'del');
    try {
      const res  = await fetch(`${API}/users/${u._id}`, { method:'DELETE' });
      const data = await res.json();
      if (res.ok) { toast.success('User deleted'); setUsers(prev => prev.filter(x => x._id !== u._id)); }
      else { toast.error(data.message || 'Failed'); }
    } catch { toast.error('Could not connect to server'); }
    finally { setActing(null); }
  };

  const filtered = users.filter(u =>
    (roleFilter === 'All' || u.role === roleFilter.toLowerCase()) &&
    (statFilter === 'All' || (statFilter === 'Active' ? u.isActive : !u.isActive)) &&
    (!search || u.fullName?.toLowerCase().includes(search.toLowerCase()) || u.nid?.includes(search) || u.email?.toLowerCase().includes(search.toLowerCase()))
  );

  const count = (fn) => users.filter(fn).length;

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage all registered users and their permissions</p>
        </div>
        <button onClick={() => toast.info('Create user via Register page for now')}
          className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          Add New User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label:'Total Users', value: users.length,                              color:'text-gray-800',  bg:'bg-white' },
          { label:'Active',      value: count(u=>u.isActive),                      color:'text-green-600', bg:'bg-green-50' },
          { label:'Suspended',   value: count(u=>!u.isActive),                     color:'text-red-600',   bg:'bg-red-50' },
          { label:'Officers',    value: count(u=>u.role==='officer'),               color:'text-purple-600',bg:'bg-purple-50' },
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
          <input type="text" placeholder="Search by name, NID, or email…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand bg-white"/>
        </div>
        <div className="flex gap-2">
          {['All','Citizen','Officer','Admin'].map(f => (
            <button key={f} onClick={() => setRoleFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${roleFilter===f?'bg-brand text-white border-brand':'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'}`}>{f}</button>
          ))}
        </div>
        <div className="flex gap-2">
          {['All','Active','Suspended'].map(f => (
            <button key={f} onClick={() => setStatFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-colors ${statFilter===f?'bg-brand text-white border-brand':'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'}`}>{f}</button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>{['#','Name','NID','Email','Mobile','Role','Joined','Status','Actions'].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-400">No users found</td></tr>
            ) : filtered.map((u,i) => (
              <tr key={u._id||i} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-gray-400 text-xs">{i+1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold text-xs flex-shrink-0">
                      {u.fullName?.[0] || '?'}
                    </div>
                    <span className="font-medium text-gray-800 text-xs">{u.fullName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs font-mono">{u.nid}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{u.email || '—'}</td>
                <td className="px-4 py-3 text-gray-500 text-xs">{u.mobile}</td>
                <td className="px-4 py-3"><span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${roleStyle[u.role]||'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
                <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}</td>
                <td className="px-4 py-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${u.isActive ? statusStyle.Active : statusStyle.Suspended}`}>
                    {u.isActive ? 'Active' : 'Suspended'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setSelected(u)}
                      className="p-1.5 rounded-lg hover:bg-brand-light text-brand transition-colors" title="View">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/></svg>
                    </button>
                    <button onClick={() => toggleStatus(u)} disabled={acting===u._id}
                      className={`p-1.5 rounded-lg transition-colors ${u.isActive?'hover:bg-red-50 text-red-500':'hover:bg-green-50 text-green-600'}`}
                      title={u.isActive?'Suspend':'Activate'}>
                      {acting===u._id
                        ? <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                        : <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d={u.isActive?"M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636":"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"}/></svg>}
                    </button>
                    <button onClick={() => deleteUser(u)} disabled={acting===u._id+'del'}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-400 transition-colors" title="Delete">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold text-xl">{selected.fullName?.[0]}</div>
              <div>
                <h2 className="font-bold text-gray-800">{selected.fullName}</h2>
                <p className="text-xs text-gray-500 capitalize">{selected.role}</p>
              </div>
            </div>
            <div className="space-y-2.5">
              {[
                { label:'NID',     value: selected.nid },
                { label:'Mobile',  value: selected.mobile },
                { label:'Email',   value: selected.email || '—' },
                { label:'Address', value: selected.address || '—' },
                { label:'Status',  value: selected.isActive ? 'Active' : 'Suspended' },
                { label:'Joined',  value: new Date(selected.createdAt).toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'}) },
              ].map((r,i) => (
                <div key={i} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <span className="text-xs text-gray-500">{r.label}</span>
                  <span className="text-xs font-medium text-gray-800 text-right max-w-[60%] truncate">{r.value}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setSelected(null)} className="mt-5 w-full bg-brand hover:bg-brand-dark text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
