'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';

const searchLinks = [
  { label: 'Land Records',    href: '/dashboard/land-records' },
  { label: 'Applications',    href: '/dashboard/applications' },
  { label: 'Notifications',   href: '/dashboard/notifications' },
  { label: 'Land Tax',        href: '/dashboard/land-tax' },
  { label: 'Documents',       href: '/dashboard/documents' },
  { label: 'Inheritance',     href: '/dashboard/inheritance' },
  { label: 'Help & Support',  href: '/dashboard/help' },
  { label: 'Settings',        href: '/dashboard/settings' },
];

export default function Topbar({ onMenuToggle }) {
  const router = useRouter();
  const { t, lang, setLang } = useLanguage();
  const { user: ctxUser, logout } = useUser();
  // Fallback to localStorage if context hasn't hydrated yet
  const user = ctxUser || (() => {
    try { const s = typeof window !== 'undefined' ? localStorage.getItem('nb_user') : null; return s ? JSON.parse(s) : null; } catch { return null; }
  })();
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const userRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = search.trim()
    ? searchLinks.filter(l => l.label.toLowerCase().includes(search.toLowerCase()))
    : searchLinks;

  const handleSearch = (e) => {
    e.preventDefault();
    if (filtered.length) router.push(filtered[0].href);
    setSearch(''); setShowSearch(false);
  };

  const notifications = [
    { text: 'Land mutation approved', time: '2h ago', read: false },
    { text: 'Tax payment reminder', time: '5h ago', read: false },
    { text: 'Document verified', time: '1d ago', read: true },
  ];
  const unread = notifications.filter(n => !n.read).length;

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 flex-shrink-0">
      {/* Hamburger – mobile */}
      <button onClick={onMenuToggle} className="lg:hidden p-1.5 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
      {/* Search */}
      <div className="flex-1 max-w-md relative" ref={null}>
        <form onSubmit={handleSearch}>
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" value={search}
            onChange={e => { setSearch(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 150)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"/>
        </form>
        {showSearch && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
            {filtered.map((l,i) => (
              <Link key={i} href={l.href} onClick={() => { setSearch(''); setShowSearch(false); }}
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-brand-light/50 transition-colors text-sm text-gray-700">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                {l.label}
              </Link>
            ))}
            {filtered.length === 0 && <p className="px-4 py-3 text-sm text-gray-400">No results found</p>}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* ── Language switcher ── */}
        <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1 bg-gray-50">
          <button
            onClick={() => setLang('bn')}
            className={`text-xs font-semibold px-2 py-0.5 rounded-md transition-colors ${lang === 'bn' ? 'bg-brand text-white' : 'text-gray-500 hover:text-brand'}`}>
            বাংলা
          </button>
          <span className="text-gray-300 text-xs">|</span>
          <button
            onClick={() => setLang('en')}
            className={`text-xs font-semibold px-2 py-0.5 rounded-md transition-colors ${lang === 'en' ? 'bg-brand text-white' : 'text-gray-500 hover:text-brand'}`}>
            EN
          </button>
        </div>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => { setShowNotif(!showNotif); setShowUser(false); }}
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            {unread > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{unread}</span>}
          </button>
          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <p className="font-semibold text-gray-800 text-sm">Notifications</p>
                <Link href="/dashboard/notifications" onClick={()=>setShowNotif(false)} className="text-xs text-brand hover:underline">View All</Link>
              </div>
              {notifications.map((n,i) => (
                <Link key={i} href="/dashboard/notifications" onClick={()=>setShowNotif(false)}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${!n.read?'bg-brand-light/30':''}`}>
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.read?'bg-brand':'bg-gray-200'}`}/>
                  <div>
                    <p className="text-xs text-gray-700">{n.text}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* User dropdown */}
        <div className="relative" ref={userRef}>
          <button onClick={() => { setShowUser(!showUser); setShowNotif(false); }}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors">
            <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-sm font-semibold text-gray-800 leading-tight">{user?.fullName || 'User'}</div>
              <div className="text-xs text-gray-500 capitalize">{user?.role || t.landowner}</div>
            </div>
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
          </button>
          {showUser && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 bg-brand-light/30">
                <p className="font-semibold text-gray-800 text-sm">{user?.fullName || 'User'}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role || t.landowner}</p>
              </div>
              {[
                { label: t.myProfile,  href:'/dashboard/settings#profile', icon:<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg> },
                { label: t.nav_settings,    href:'/dashboard/settings',         icon:<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg> },
                { label: t.nav_help,        href:'/dashboard/help',             icon:<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg> },
              ].map((item,i) => (
                <Link key={i} href={item.href} onClick={()=>setShowUser(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <span className="text-gray-400">{item.icon}</span>{item.label}
                </Link>
              ))}
              <div className="border-t border-gray-100">
                <button
                  onClick={() => {
                    logout();
                    setShowUser(false);
                    router.push('/login');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                  {t.logout}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
