'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';

const API = process.env.NEXT_PUBLIC_API_URL  || 'http://localhost:5000/api';

const statusBadge = {
  Verified: 'bg-green-500',
  Pending:  'bg-yellow-400',
  Rejected: 'bg-red-500',
  Draft:    'bg-gray-400',
};

const services = [
  { labelKey:'nav_applications', descKey:'appSubtitle',    href:'/dashboard/applications',
    icon:<svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg> },
  { labelKey:'nav_landTax',      descKey:'taxSubtitle',    href:'/dashboard/land-tax',
    icon:<svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
  { labelKey:'nav_inheritance',  descKey:'inheritSubtitle',href:'/dashboard/inheritance',
    icon:<svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
  { labelKey:'nav_documents',    descKey:'docSubtitle',    href:'/dashboard/documents',
    icon:<svg className="w-7 h-7 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg> },
];

export default function DashboardContent() {
  const { t }              = useLanguage();
  const { user }           = useUser();
  const [records,  setRecords]  = useState([]);
  const [stats,    setStats]    = useState({ records: 0, applications: 0, pendingTax: 0 });
  const [loading,  setLoading]  = useState(true);

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? (t.lang === 'bn' ? 'শুভ সকাল,' : 'Good Morning,')
                 : hour < 17 ? (t.lang === 'bn' ? 'শুভ অপরাহ্ন,' : 'Good Afternoon,')
                 :              (t.lang === 'bn' ? 'শুভ সন্ধ্যা,' : 'Good Evening,');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [recRes, appRes, taxRes] = await Promise.all([
          fetch(`${API}/land-records?limit=4`),
          fetch(`${API}/applications?status=Pending&limit=100`),
          fetch(`${API}/land-tax?status=Unpaid&limit=100`),
        ]);

        const [recData, appData, taxData] = await Promise.all([
          recRes.json(), appRes.json(), taxRes.json(),
        ]);

        if (recRes.ok) setRecords(recData.records || []);

        const pendingTax = (taxData.taxes || []).reduce((s, t) => s + (t.amount || 0), 0);

        setStats({
          records:      recData.total || recData.records?.length || 0,
          applications: appData.total || 0,
          pendingTax,
        });
      } catch (err) {
        console.error('Dashboard fetch failed:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const userName = user?.fullName || 'User';

  return (
    <div className="bg-gray-50 min-h-full w-full">
      <div className="p-5 space-y-5">

        {/* ── Hero Banner ── */}
        <div className="relative rounded-2xl overflow-hidden h-44"
          style={{ backgroundImage:"url('/bg.png')", backgroundSize:'cover', backgroundPosition:'center' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-transparent"/>
          <div className="relative z-10 p-6 h-full flex flex-col justify-center">
            <p className="text-white/80 text-sm">{greeting}</p>
            <h1 className="text-white text-2xl font-bold flex items-center gap-2">
              {userName} <span>👋</span>
            </h1>
            <p className="text-white/70 text-sm mt-1 max-w-xs">{t.dashSubtitle}</p>
          </div>
          <div className="absolute right-6 bottom-6 text-right">
            <p className="text-white/90 font-bold text-lg italic leading-tight drop-shadow">
              {t.dashTagline?.split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br/>}</span>)}
            </p>
          </div>
        </div>

        {/* ── Stats Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: t.totalLandRecords,   value: loading ? '…' : stats.records,                                 href:'/dashboard/land-records',   icon:<svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg> },
            { label: t.pendingApplications,value: loading ? '…' : stats.applications,                             href:'/dashboard/applications',   icon:<svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg> },
            { label: t.unreadNotifications,value: '3',                                                             href:'/dashboard/notifications',  icon:<svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg> },
            { label: t.totalTaxDue,        value: loading ? '…' : `৳ ${stats.pendingTax.toLocaleString()}`,       href:'/dashboard/land-tax',       valueClass:'text-red-600', icon:<svg className="w-6 h-6 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg> },
          ].map((s, i) => (
            <Link key={i} href={s.href} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">{s.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 leading-tight">{s.label}</p>
                <p className={`text-xl font-bold mt-0.5 ${s.valueClass || 'text-gray-800'}`}>{s.value}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </Link>
          ))}
        </div>

        {/* ── My Land Records ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
              {t.myLandRecords}
            </div>
            <Link href="/dashboard/land-records" className="text-sm text-brand font-medium hover:underline flex items-center gap-1">
              {t.viewAll} <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {[...Array(4)].map((_,i) => (
                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden animate-pulse">
                  <div className="h-28 bg-gray-200"/>
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"/>
                    <div className="h-3 bg-gray-100 rounded w-1/2"/>
                    <div className="h-7 bg-gray-100 rounded mt-2"/>
                  </div>
                </div>
              ))}
            </div>
          ) : records.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
              <p className="text-gray-400 text-sm">{t.noRecordsYet}</p>
              <Link href="/dashboard/land-records/new" className="text-brand text-sm font-medium hover:underline mt-1 inline-block">{t.addFirstRecord}</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
              {records.slice(0, 4).map((r, i) => (
                <div key={r._id||i} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-28 overflow-hidden bg-gray-200">
                    {r.photoUrl ? (
                      <img src={r.photoUrl} alt={r.title} className="w-full h-full object-cover"
                        onError={e => { e.target.style.display='none'; e.target.parentNode.style.background='linear-gradient(135deg,#4a9e4acc,#4a9e4a88)'; }}/>
                    ) : (
                      <div className="w-full h-full" style={{background:'linear-gradient(135deg,#4a9e4acc,#2d6b3588)'}}/>
                    )}
                    <span className={`absolute top-2 left-2 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusBadge[r.status]||'bg-gray-400'}`}>
                      {r.status==='Verified'&&'✓ '}{r.status}
                    </span>
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{r.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      <svg className="w-3 h-3 inline mr-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/></svg>
                      {r.location?.district}{r.location?.division?`, ${r.location.division}`:''}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {r.size?.value} {r.size?.unit} · <span className="text-brand font-medium">{r.recordId}</span>
                    </p>
                    <Link href={`/dashboard/land-records/edit?id=${r._id}`}
                      className="mt-2 w-full text-xs text-brand font-medium border border-brand/20 rounded-lg py-1.5 hover:bg-brand-light transition-colors flex items-center justify-center gap-1">
                      {t.viewDetails}
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Services Grid ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {services.map((s, i) => (
            <Link key={i} href={s.href} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow group block">
              <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center mb-3 group-hover:bg-brand/10 transition-colors">{s.icon}</div>
              <h3 className="font-semibold text-gray-800 text-sm">{t[s.labelKey]}</h3>
              <p className="text-xs text-gray-500 mt-1 leading-snug">{t[s.descKey]}</p>
              <div className="mt-3 flex items-center justify-end">
                <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2 pb-1 border-t border-gray-100">
          <span>© 2025 <span className="font-semibold text-gray-500">Nagorik Bhumi</span>. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-brand transition-colors">Privacy Policy</Link>
            <Link href="/terms"   className="hover:text-brand transition-colors">Terms of Service</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
