'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  {
    label: 'Dashboard', href: '/admin',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>,
  },
  {
    label: 'Pending Approvals', href: '/admin/applications', badge: 12,
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  },
  {
    label: 'Approved Records', href: '/admin/land-records', badge: 248,
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
  },
  {
    label: 'All Land Records', href: '/admin/land-records',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>,
  },
  {
    label: 'User Management', href: '/admin/users',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>,
  },
  {
    label: 'Document Verification', href: '/admin/documents', badge: 7,
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
  },
  {
    label: 'Settings', href: '/admin/settings',
    icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen flex flex-col flex-shrink-0" style={{ background: 'linear-gradient(180deg, #0f3d1f 0%, #1a6b3c 60%, #145530 100%)' }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-md overflow-hidden p-0.5">
          <Image src="/Logooo.png" alt="Logo" width={48} height={48} style={{ objectFit: 'contain', width: '100%', height: '100%' }} />
        </div>
        <div>
          <div className="text-white font-bold text-sm leading-tight">Nagorik Bhumi</div>
          <div className="text-white/50 text-[10px]">Land Services for a Better Bangladesh</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          return (
            <Link key={item.label} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                active ? 'bg-white text-brand' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}>
              <span className={active ? 'text-brand' : 'text-white/60'}>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 min-w-[20px] text-center ${active ? 'bg-brand text-white' : 'bg-white/20 text-white'}`}>
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom landscape + logout */}
      <div className="px-4 pb-2">
        <svg viewBox="0 0 180 70" className="w-full opacity-40 mb-3">
          <rect width="180" height="70" rx="8" fill="#0a2a10"/>
          <path d="M0 45 Q45 25 90 38 Q135 51 180 30 L180 70 L0 70Z" fill="#1a5a20"/>
          <path d="M0 55 Q45 40 90 50 Q135 60 180 45 L180 70 L0 70Z" fill="#0f3d18"/>
          <ellipse cx="25" cy="32" rx="14" ry="20" fill="#145530"/>
          <ellipse cx="155" cy="28" rx="14" ry="20" fill="#145530"/>
          <rect x="75" y="28" width="30" height="22" rx="3" fill="#c8dfc0" opacity="0.7"/>
          <polygon points="90,16 68,30 112,30" fill="#a0c090" opacity="0.8"/>
        </svg>
        <button
          onClick={() => {
            localStorage.removeItem('nb_user');
            localStorage.removeItem('nb_token');
            window.location.href = '/admin-login';
          }}
          className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-white/70 hover:bg-white/10 hover:text-white text-sm font-medium transition-all w-full">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
          Logout
        </button>
      </div>
    </aside>
  );
}
