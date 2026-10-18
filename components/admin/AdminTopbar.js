'use client';

import { useLanguage } from '@/context/LanguageContext';

export default function AdminTopbar({ onMenuToggle }) {
  const { lang, setLang } = useLanguage();

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-5 gap-4 flex-shrink-0">
      {/* Hamburger */}
      <button onClick={onMenuToggle} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
        <input type="text" placeholder={lang === 'bn' ? 'NID, প্লট নম্বর বা আবেদনকারীর নাম দিয়ে খুঁজুন...' : 'Search by NID, plot number, or applicant name...'}
          className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"/>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Language switcher */}
        <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-2 py-1 bg-gray-50">
          <button onClick={() => setLang('bn')}
            className={`text-xs font-semibold px-2 py-0.5 rounded-md transition-colors ${lang==='bn'?'bg-brand text-white':'text-gray-500 hover:text-brand'}`}>
            বাংলা
          </button>
          <span className="text-gray-300 text-xs">|</span>
          <button onClick={() => setLang('en')}
            className={`text-xs font-semibold px-2 py-0.5 rounded-md transition-colors ${lang==='en'?'bg-brand text-white':'text-gray-500 hover:text-brand'}`}>
            EN
          </button>
        </div>

        {/* Bell */}
        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">12</span>
        </button>

        {/* Admin user + logout */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-2 py-1.5">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/></svg>
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-800 leading-tight">Admin</div>
              <div className="text-xs text-gray-500">{lang==='bn'?'সিস্টেম অ্যাডমিন':'System Administrator'}</div>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('nb_user');
              localStorage.removeItem('nb_token');
              window.location.href = '/admin-login';
            }}
            className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
            title="Logout">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          </button>
        </div>
      </div>
    </header>
  );
}
