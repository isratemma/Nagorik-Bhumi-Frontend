'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';

const navKeys = [
  { key:'nav_dashboard',    href:'/dashboard',               badge:null },
  { key:'nav_landRecords',  href:'/dashboard/land-records',  badge:null },
  { key:'nav_applications', href:'/dashboard/applications',  badge:null },
  { key:'nav_notifications',href:'/dashboard/notifications', badge:3    },
  { key:'nav_landTax',      href:'/dashboard/land-tax',      badge:null },
  { key:'nav_inheritance',  href:'/dashboard/inheritance',   badge:null },
  { key:'nav_documents',    href:'/dashboard/documents',     badge:null },
  { key:'nav_help',         href:'/dashboard/help',          badge:null },
  { key:'nav_settings',     href:'/dashboard/settings',      badge:null },
];

const icons = {
  nav_dashboard:    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  nav_landRecords:  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  nav_applications: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>,
  nav_notifications:<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>,
  nav_landTax:      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>,
  nav_inheritance:  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>,
  nav_documents:    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>,
  nav_help:         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>,
  nav_settings:     <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
};

export default function Sidebar() {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <aside className="w-56 min-h-screen bg-brand flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden p-0.5">
          <Image src="/Logooo.png" alt="Logo" width={48} height={48}
            style={{ objectFit:'contain', width:'100%', height:'100%' }}/>
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight">{t.brandName}</div>
          <div className="text-white/60 text-[10px]">{t.tagline}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {navKeys.map(item => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active ? 'bg-white text-brand' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}>
              <span className={active ? 'text-brand' : 'text-white/70'}>{icons[item.key]}</span>
              <span className="flex-1">{t[item.key]}</span>
              {item.badge && (
                <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center
                  ${active ? 'bg-brand text-white' : 'bg-white/20 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom illustration */}
      <div className="px-4 pb-3">
        <svg viewBox="0 0 180 70" className="w-full opacity-40 mb-2">
          <rect width="180" height="70" rx="8" fill="#0a2a10"/>
          <path d="M0 45 Q45 25 90 38 Q135 51 180 30 L180 70 L0 70Z" fill="#1a5a20"/>
          <path d="M0 55 Q45 40 90 50 Q135 60 180 45 L180 70 L0 70Z" fill="#0f3d18"/>
          <ellipse cx="25" cy="32" rx="14" ry="20" fill="#145530"/>
          <ellipse cx="155" cy="28" rx="14" ry="20" fill="#145530"/>
          <rect x="75" y="28" width="30" height="22" rx="3" fill="#c8dfc0" opacity="0.7"/>
          <polygon points="90,16 68,30 112,30" fill="#a0c090" opacity="0.8"/>
        </svg>
        <div className="text-white/80 text-xs px-1">
          <div className="font-semibold text-[11px]">{t.nav_secureYourLand}</div>
          <div className="text-white/50 text-[10px] mt-0.5">{t.nav_buildBetter}</div>
        </div>
      </div>
    </aside>
  );
}
