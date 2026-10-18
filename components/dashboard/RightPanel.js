'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

const notifications = [
  { type:'success', text:'Your application for land mutation has been approved.', time:'2 hours ago' },
  { type:'info',    text:'Land tax payment reminder for 5.00 Katha plot.',        time:'5 hours ago' },
  { type:'message', text:'New message from a buyer regarding your land.',          time:'1 day ago' },
  { type:'success', text:'Your document has been verified.',                       time:'1 day ago' },
];

const iconMap = {
  success: <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"><svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg></div>,
  info:    <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center flex-shrink-0"><svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>,
  message: <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0"><svg className="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg></div>,
};

const quickActions = [
  { label:'Add Land Record',    href:'/dashboard/land-records/new',  icon:<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg> },
  { label:'Submit Application', href:'/dashboard/applications/new',  icon:<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg> },
  { label:'Pay Land Tax',       href:'/dashboard/land-tax',          icon:<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg> },
  { label:'Upload Document',    href:'/dashboard/documents',         icon:<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg> },
];

export default function RightPanel() {
  const { t } = useLanguage();
  return (
    <aside className="w-full flex flex-col gap-4">
      {/* Notifications */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm">
            <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
            Notifications
          </div>
          <Link href="/dashboard/notifications" className="text-xs text-brand font-medium hover:underline">{t.viewAll}</Link>
        </div>
        <div className="space-y-3">
          {notifications.map((n,i) => (
            <Link key={i} href="/dashboard/notifications"
              className="flex items-start gap-2 pb-3 border-b border-gray-50 last:border-0 last:pb-0 hover:bg-gray-50 rounded-lg transition-colors -mx-1 px-1">
              {iconMap[n.type]}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700 leading-snug">{n.text}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{n.time}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-3">
          <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          Quick Actions
        </div>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((a,i) => (
            <Link key={i} href={a.href}
              className="flex flex-col items-center gap-1.5 p-3 rounded-lg border border-gray-100 hover:border-brand/30 hover:bg-brand-light/40 transition-all group text-center">
              <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white transition-colors">
                {a.icon}
              </div>
              <span className="text-[11px] text-gray-600 font-medium leading-tight">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Need Help */}
      <div className="bg-brand-light rounded-xl border border-brand/10 p-4 relative overflow-hidden">
        <svg className="absolute right-0 bottom-0 w-20 opacity-20" viewBox="0 0 80 100" fill="none">
          <path d="M80 100 C60 70 65 30 40 10 C60 30 75 60 80 100Z" fill="#1a6b3c"/>
          <path d="M80 100 C50 80 45 40 20 20 C50 45 70 70 80 100Z" fill="#2d8a55"/>
        </svg>
        <div className="flex items-center gap-2 font-semibold text-gray-800 text-sm mb-1">
          <div className="w-7 h-7 bg-brand rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </div>
          Need Help?
        </div>
        <p className="text-xs text-gray-500 mb-3 leading-snug">Our support team is here to assist you with any queries or issues.</p>
        <Link href="/dashboard/help"
          className="w-full bg-brand hover:bg-brand-dark text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors">
          Contact Support          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
        </Link>
      </div>
    </aside>
  );
}
