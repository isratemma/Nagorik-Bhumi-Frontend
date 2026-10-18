'use client';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

const API = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function AdminReportsPage() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [year,    setYear]    = useState('2024');

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [recRes, appRes, usrRes, taxRes] = await Promise.all([
        fetch(`${API}/land-records?limit=1000`),
        fetch(`${API}/applications?limit=1000`),
        fetch(`${API}/users?limit=1000`),
        fetch(`${API}/land-tax?limit=1000`),
      ]);
      const [recData, appData, usrData, taxData] = await Promise.all([
        recRes.json(), appRes.json(), usrRes.json(), taxRes.json(),
      ]);

      const records      = recData.records || [];
      const applications = appData.applications || [];
      const users        = usrData.users || [];
      const taxes        = taxData.taxes || [];

      // Monthly counts from real data
      const monthly = months.map((m, idx) => {
        const filter = (arr, dateField) => arr.filter(x => {
          const d = new Date(x[dateField]);
          return d.getFullYear() === Number(year) && d.getMonth() === idx;
        });
        const recs = filter(records, 'createdAt');
        const apps = filter(applications, 'createdAt');
        const paidTax = filter(taxes.filter(t=>t.status==='Paid'), 'paidAt');
        return {
          month: m,
          records: recs.length,
          applications: apps.length,
          tax: paidTax.reduce((s,t) => s + (t.amount||0), 0),
        };
      });

      const totalTax = taxes.filter(t=>t.status==='Paid').reduce((s,t)=>s+(t.amount||0),0);

      setStats({
        totalRecords:   records.length,
        totalApps:      applications.length,
        totalUsers:     users.length,
        totalTax,
        approvedRecords:records.filter(r=>r.status==='Verified').length,
        pendingApps:    applications.filter(a=>a.status==='Pending').length,
        monthly,
        // Land type distribution
        byType: ['Residential','Agricultural','Commercial','Industrial','Other'].map(type => ({
          label: type,
          value: records.filter(r=>r.type===type).length,
          color: {Residential:'#1a6b3c',Agricultural:'#3a9a5c',Commercial:'#6ec28a',Industrial:'#9dd4b0',Other:'#c6e8d4'}[type],
        })).filter(x => x.value > 0),
      });
    } catch (err) {
      toast.error('Could not load reports data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, [year]);

  const exportCSV = () => {
    if (!stats) return;
    const csv = ['Month,Records,Applications,Tax Collected'].concat(
      stats.monthly.map(d => `${d.month},${d.records},${d.applications},${d.tax}`)
    ).join('\n');
    const b = new Blob([csv], {type:'text/csv'});
    Object.assign(document.createElement('a'), {href:URL.createObjectURL(b), download:`report-${year}.csv`}).click();
    toast.success('Report exported');
  };

  const maxRec = stats ? Math.max(...stats.monthly.map(d=>d.records), 1) : 1;
  const maxApp = stats ? Math.max(...stats.monthly.map(d=>d.applications), 1) : 1;

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">System-wide statistics from MongoDB</p>
        </div>
        <div className="flex gap-2">
          <select value={year} onChange={e => setYear(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-brand/20">
            {['2026','2025','2024','2023'].map(y => <option key={y}>{y}</option>)}
          </select>
          <button onClick={exportCSV}
            className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {loading ? [...Array(4)].map((_,i) => <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse"/>) : stats ? [
          { label:'Total Land Records',   value: stats.totalRecords,                     color:'text-brand',      bg:'bg-brand-light' },
          { label:'Total Applications',   value: stats.totalApps,                        color:'text-blue-600',   bg:'bg-blue-50' },
          { label:'Registered Users',     value: stats.totalUsers,                       color:'text-orange-500', bg:'bg-orange-50' },
          { label:'Tax Collected (Total)',value:`৳ ${stats.totalTax.toLocaleString()}`, color:'text-green-600',  bg:'bg-green-50' },
        ].map((s,i) => (
          <div key={i} className={`${s.bg} border border-gray-100 rounded-xl p-4`}>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        )) : null}
      </div>

      {/* Charts */}
      {!loading && stats && (
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">Monthly Land Records ({year})</h2>
            <div className="flex items-end gap-1.5 h-36">
              {stats.monthly.map((d,i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-brand rounded-t-sm hover:bg-brand-dark transition-all cursor-pointer"
                    style={{height:`${(d.records/maxRec)*100}%`,minHeight:'2px'}}
                    title={`${d.month}: ${d.records}`}/>
                  <span className="text-[9px] text-gray-400">{d.month}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="font-semibold text-gray-800 text-sm mb-4">Monthly Applications ({year})</h2>
            <div className="flex items-end gap-1.5 h-36">
              {stats.monthly.map((d,i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full bg-blue-400 rounded-t-sm hover:bg-blue-500 transition-all cursor-pointer"
                    style={{height:`${(d.applications/maxApp)*100}%`,minHeight:'2px'}}
                    title={`${d.month}: ${d.applications}`}/>
                  <span className="text-[9px] text-gray-400">{d.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Monthly table */}
      {!loading && stats && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 text-sm">Monthly Summary ({year})</h2>
            <span className="text-xs text-gray-400">Live data from MongoDB</span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{['Month','Land Records','Applications','Tax Collected'].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.monthly.map((d,i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-700">{d.month} {year}</td>
                  <td className="px-5 py-3 text-gray-600">{d.records}</td>
                  <td className="px-5 py-3 text-gray-600">{d.applications}</td>
                  <td className="px-5 py-3 text-gray-600">৳ {d.tax.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
