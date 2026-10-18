'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';

const quickActions = [
  { label:'Add New Land Record', href:'/admin/land-records', icon:<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg> },
  { label:'Review Applications',  href:'/admin/applications', icon:<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"/></svg> },
  { label:'Manage Users',         href:'/admin/users',        icon:<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
  { label:'Verify Documents',     href:'/admin/documents',    icon:<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> },
  { label:'Land Tax Overview',    href:'/admin/land-tax',     icon:<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
  { label:'Generate Reports',     href:'/admin/reports',      icon:<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg> },
];

const typeColor   = { Residential:'text-blue-600 bg-blue-50', Agricultural:'text-green-600 bg-green-50', Commercial:'text-orange-500 bg-orange-50' };
const statusColor = { Verified:'bg-green-100 text-green-700', Approved:'bg-green-100 text-green-700', Pending:'bg-yellow-100 text-yellow-700', Rejected:'bg-red-100 text-red-600' };

// Chart helpers
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const W=540, H=150, pL=36, pB=22, pT=10, pR=10;
const iW=W-pL-pR, iH=H-pT-pB;
const tx = i => pL+(i/(months.length-1))*iW;
const ty = (v,max) => pT+iH-(v/Math.max(max,1))*iH;
const pts = (d,max) => d.map((v,i)=>`${tx(i)},${ty(v,max)}`).join(' ');
const area = (d,max) => `${pL},${pT+iH} ${pts(d,max)} ${tx(months.length-1)},${pT+iH}`;

// Donut
function buildDonut(items) {
  const cx=80,cy=80,R=62,r=42;
  let angle=-Math.PI/2;
  return items.map(d=>{
    const sweep=(d.pct/100)*2*Math.PI;
    const x1=cx+R*Math.cos(angle),y1=cy+R*Math.sin(angle);
    angle+=sweep;
    const x2=cx+R*Math.cos(angle),y2=cy+R*Math.sin(angle);
    const ix1=cx+r*Math.cos(angle),iy1=cy+r*Math.sin(angle);
    const ix2=cx+r*Math.cos(angle-sweep),iy2=cy+r*Math.sin(angle-sweep);
    const lg=d.pct>50?1:0;
    return {...d,path:`M${x1} ${y1} A${R} ${R} 0 ${lg} 1 ${x2} ${y2} L${ix1} ${iy1} A${r} ${r} 0 ${lg} 0 ${ix2} ${iy2}Z`};
  });
}

export default function AdminDashboardPage() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [recRes, appRes, usrRes, taxRes, docRes] = await Promise.all([
          fetch(`${API}/land-records?limit=1000`),
          fetch(`${API}/applications?limit=1000`),
          fetch(`${API}/users?limit=1000`),
          fetch(`${API}/land-tax?limit=1000`),
          fetch(`${API}/documents?limit=1000`),
        ]);
        const [recD, appD, usrD, taxD, docD] = await Promise.all([
          recRes.json(), appRes.json(), usrRes.json(), taxRes.json(), docRes.json(),
        ]);

        const records      = recD.records      || [];
        const applications = appD.applications || [];
        const users        = usrD.users        || [];
        const taxes        = taxD.taxes        || [];
        const documents    = docD.documents    || [];

        // Monthly data (current year)
        const year = new Date().getFullYear();
        const monthlyRec = months.map((_,m) => records.filter(r=>{const d=new Date(r.createdAt);return d.getFullYear()===year&&d.getMonth()===m;}).length);
        const monthlyApp = months.map((_,m) => applications.filter(a=>{const d=new Date(a.createdAt);return d.getFullYear()===year&&d.getMonth()===m;}).length);

        // Land type distribution
        const types = ['Residential','Agricultural','Commercial','Industrial','Other'];
        const typeCounts = types.map(tp => ({label:tp, value:records.filter(r=>r.type===tp).length})).filter(x=>x.value>0);
        const total = typeCounts.reduce((s,x)=>s+x.value,0)||1;
        const colors = ['#1a6b3c','#3a9a5c','#6ec28a','#9dd4b0','#c6e8d4'];
        const donutItems = typeCounts.map((x,i)=>({...x,pct:(x.value/total)*100,color:colors[i]}));

        setData({
          totalRecords:    records.length,
          totalApps:       applications.length,
          totalUsers:      users.length,
          approvedRecords: records.filter(r=>r.status==='Verified').length,
          pendingApps:     applications.filter(a=>a.status==='Pending').length,
          pendingDocs:     documents.filter(d=>d.status==='Pending').length,
          pendingRecords:  records.filter(r=>r.status==='Pending').slice(0,5),
          recentRecords:   records.slice(-5).reverse(),
          recentUsers:     users.slice(-5).reverse(),
          monthlyRec, monthlyApp,
          donutItems: buildDonut(donutItems),
          donutTotal: records.length,
        });
      } catch (err) {
        console.error('Admin dash fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const maxRec = data ? Math.max(...data.monthlyRec, 1) : 1;
  const maxApp = data ? Math.max(...data.monthlyApp, 1) : 1;

  return (
    <div className="p-5 space-y-5 bg-gray-50 min-h-full">

      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-40"
        style={{backgroundImage:"url('/bg.png')",backgroundSize:'cover',backgroundPosition:'center top'}}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/25 to-transparent"/>
        <div className="relative z-10 p-6 h-full flex flex-col justify-center">
          <p className="text-white/80 text-sm">Good Morning, Admin</p>
          <h1 className="text-white text-2xl font-bold mt-0.5">Welcome to Nagorik Bhumi</h1>
          <p className="text-white/70 text-sm mt-1 max-w-sm">Manage land records, approvals, users and system settings — all in one place.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-3">
        {loading ? [...Array(5)].map((_,i)=><div key={i} className="h-28 bg-gray-200 rounded-xl animate-pulse"/>) : [
          { label:'Total Land Records',   value: data.totalRecords,    change:'+live', up:true,  color:'text-brand',      bg:'bg-brand-light',   icon:<svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg> },
          { label:'Total Applications',   value: data.totalApps,       change:'+live', up:true,  color:'text-blue-600',   bg:'bg-blue-50',        icon:<svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
          { label:'Registered Users',     value: data.totalUsers,      change:'+live', up:true,  color:'text-orange-500', bg:'bg-orange-50',      icon:<svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
          { label:'Approved Records',     value: data.approvedRecords, change:'+live', up:true,  color:'text-purple-600', bg:'bg-purple-50',      icon:<svg className="w-7 h-7 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
          { label:'Pending Approvals',    value: data.pendingApps,     change:'live',  up:false, color:'text-red-500',    bg:'bg-red-50',         icon:<svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
        ].map((s,i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center`}>{s.icon}</div>
              <p className="text-xs text-gray-500 leading-tight">{s.label}</p>
            </div>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs mt-1 text-gray-400">📡 real-time from MongoDB</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {data && (
        <div className="grid grid-cols-3 gap-4">
          {/* Line chart */}
          <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-gray-800 text-sm">Monthly Overview</h2>
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-brand inline-block rounded"/>Records</span>
                <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-400 inline-block rounded"/>Applications</span>
              </div>
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
              {[0,Math.round(maxRec/2),maxRec].map(v=>(
                <g key={v}>
                  <line x1={pL} y1={ty(v,maxRec)} x2={W-pR} y2={ty(v,maxRec)} stroke="#f3f4f6" strokeWidth="1"/>
                  <text x={pL-4} y={ty(v,maxRec)+4} textAnchor="end" fontSize="9" fill="#9ca3af">{v}</text>
                </g>
              ))}
              {months.map((m,i)=><text key={m} x={tx(i)} y={H-5} textAnchor="middle" fontSize="9" fill="#9ca3af">{m}</text>)}
              <polygon points={area(data.monthlyRec,maxRec)} fill="#1a6b3c" opacity="0.07"/>
              <polygon points={area(data.monthlyApp,maxApp)} fill="#3b82f6" opacity="0.07"/>
              <polyline points={pts(data.monthlyRec,maxRec)} fill="none" stroke="#1a6b3c" strokeWidth="2" strokeLinejoin="round"/>
              <polyline points={pts(data.monthlyApp,maxApp)} fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinejoin="round"/>
              {data.monthlyRec.map((v,i)=><circle key={i} cx={tx(i)} cy={ty(v,maxRec)} r="3" fill="#1a6b3c"/>)}
              {data.monthlyApp.map((v,i)=><circle key={i} cx={tx(i)} cy={ty(v,maxApp)} r="3" fill="#3b82f6"/>)}
            </svg>
          </div>

          {/* Donut */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h2 className="font-semibold text-gray-800 text-sm mb-3">Land Type Distribution</h2>
            <div className="flex items-center gap-3">
              <svg viewBox="0 0 160 160" className="w-36 flex-shrink-0">
                {data.donutItems.map((d,i)=>(
                  <path key={i} d={d.path} fill={d.color} stroke="white" strokeWidth="1.5"/>
                ))}
                <text x="80" y="75" textAnchor="middle" fontSize="17" fontWeight="bold" fill="#1a6b3c">{data.donutTotal}</text>
                <text x="80" y="90" textAnchor="middle" fontSize="8" fill="#9ca3af">Total Records</text>
              </svg>
              <div className="space-y-1.5 flex-1 min-w-0">
                {data.donutItems.map((d,i)=>(
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:d.color}}/>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-700 truncate">{d.label}</p>
                      <p className="text-[10px] text-gray-400">{d.value} ({d.pct.toFixed(1)}%)</p>
                    </div>
                  </div>
                ))}
                {data.donutItems.length === 0 && <p className="text-xs text-gray-400">No records yet</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom row */}
      {data && (
        <div className="grid grid-cols-3 gap-4">
          {/* Pending approvals */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-800">Pending Approvals</span>
              <Link href="/admin/applications" className="text-xs text-brand hover:underline">View All →</Link>
            </div>
            {data.pendingRecords.length === 0 ? (
              <p className="px-4 py-6 text-xs text-gray-400 text-center">No pending records ✓</p>
            ) : (
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{['#','Title','Type','Action'].map(h=><th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-gray-400">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.pendingRecords.map((r,i)=>(
                    <tr key={r._id||i} className="hover:bg-gray-50">
                      <td className="px-3 py-2.5 text-gray-400">{i+1}</td>
                      <td className="px-3 py-2.5 font-medium text-gray-700 text-[11px] truncate max-w-[80px]">{r.title}</td>
                      <td className="px-3 py-2.5"><span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${typeColor[r.type]||'bg-gray-100 text-gray-600'}`}>{r.type}</span></td>
                      <td className="px-3 py-2.5">
                        <Link href="/admin/land-records" className="text-[10px] bg-brand text-white px-2 py-0.5 rounded-lg hover:bg-brand-dark font-semibold">Review</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Recent records */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="text-sm font-semibold text-gray-800">Recent Land Records</span>
              <Link href="/admin/land-records" className="text-xs text-brand hover:underline">View All →</Link>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['#','Record ID','Type','Status'].map(h=><th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-gray-400">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentRecords.length === 0 ? (
                  <tr><td colSpan={4} className="px-3 py-4 text-center text-gray-400 text-[11px]">No records yet</td></tr>
                ) : data.recentRecords.map((r,i)=>(
                  <tr key={r._id||i} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 text-gray-400">{i+1}</td>
                    <td className="px-3 py-2.5 font-semibold text-brand text-[11px]">{r.recordId}</td>
                    <td className="px-3 py-2.5"><span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${typeColor[r.type]||'bg-gray-100 text-gray-600'}`}>{r.type}</span></td>
                    <td className="px-3 py-2.5"><span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${statusColor[r.status]||'bg-gray-100 text-gray-500'}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Actions + Recent Users */}
          <div className="flex flex-col gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 mb-3">
                <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Quick Actions
              </div>
              <div className="space-y-1">
                {quickActions.map((a,i)=>(
                  <Link key={i} href={a.href} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-brand-light/50 transition-colors group">
                    <div className="w-7 h-7 rounded-lg bg-brand-light flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors flex-shrink-0">{a.icon}</div>
                    <span className="text-xs font-medium text-gray-700 group-hover:text-brand flex-1">{a.label}</span>
                    <svg className="w-3.5 h-3.5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <span className="text-sm font-semibold text-gray-800">Recent Users</span>
                <Link href="/admin/users" className="text-xs text-brand hover:underline">View All →</Link>
              </div>
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>{['Name','Role','Status'].map(h=><th key={h} className="text-left px-3 py-2 text-[10px] font-semibold text-gray-400">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.recentUsers.length === 0 ? (
                    <tr><td colSpan={3} className="px-3 py-4 text-center text-gray-400 text-[11px]">No users yet</td></tr>
                  ) : data.recentUsers.map((u,i)=>(
                    <tr key={u._id||i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 font-medium text-gray-700 text-[11px]">{u.fullName?.split(' ')[0]}</td>
                      <td className="px-3 py-2 text-gray-500 text-[11px] capitalize">{u.role}</td>
                      <td className="px-3 py-2"><span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${u.isActive?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{u.isActive?'Active':'Off'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-brand rounded-xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
        </div>
        <div>
          <p className="text-white font-semibold text-sm">Secure, Transparent, For a Better Bangladesh</p>
          <p className="text-white/70 text-xs">Nagorik Bhumi — All data is live from MongoDB</p>
        </div>
      </div>

    </div>
  );
}
