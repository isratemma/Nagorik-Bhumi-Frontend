'use client';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';

const allNotifications = [
  { type: 'success', title: 'Application Approved', text: 'Your application for land mutation has been approved.', time: '2 hours ago', read: false },
  { type: 'warning', title: 'Tax Payment Reminder', text: 'Land tax payment reminder for 5.00 Katha plot in Gazipur.', time: '5 hours ago', read: false },
  { type: 'info', title: 'New Message', text: 'New message from a buyer regarding your Savar land.', time: '1 day ago', read: false },
  { type: 'success', title: 'Document Verified', text: 'Your ownership document has been verified successfully.', time: '1 day ago', read: true },
  { type: 'info', title: 'Survey Scheduled', text: 'Land survey for LN-00125 scheduled for 20 Oct 2024.', time: '2 days ago', read: true },
  { type: 'warning', title: 'Action Required', text: 'Please upload the missing NID copy for APP-2024-003.', time: '3 days ago', read: true },
  { type: 'success', title: 'Record Added', text: 'New land record LN-00128 has been added to your account.', time: '5 days ago', read: true },
  { type: 'info', title: 'System Update', text: 'Nagorik Bhumi has been updated with new features.', time: '1 week ago', read: true },
];

const typeStyle = {
  success: { bg: 'bg-green-100', icon: 'text-green-600', dot: 'bg-green-500' },
  warning: { bg: 'bg-yellow-100', icon: 'text-yellow-600', dot: 'bg-yellow-500' },
  info: { bg: 'bg-blue-100', icon: 'text-blue-500', dot: 'bg-blue-500' },
};

const typeIcon = {
  success: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>,
  warning: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>,
  info: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
};

export default function NotificationsPage() {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState(allNotifications);
  const [filter, setFilter] = useState('All');

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));
  const markRead = (i) => setNotifications(n => n.map((x, idx) => idx === i ? { ...x, read: true } : x));

  const filtered = notifications.filter(n => filter === 'All' ? true : filter === t.unread ? !n.read : n.read);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {t.notifications}
            {unreadCount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">{t.notifSubtitle}</p>
        </div>
        <button onClick={markAllRead} className="text-sm text-brand font-medium hover:underline">{t.markAllRead}</button>
      </div>

      <div className="flex gap-2 mb-4">
        {[
          { key:'all',    label: t.viewAll.replace('All','All').split(' ')[0] || 'All' },
          { key:'unread', label: t.unread },
          { key:'read',   label: t.read   },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(label)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors border ${filter===label?'bg-brand text-white border-brand':'bg-white text-gray-600 border-gray-200 hover:border-brand hover:text-brand'}`}>
            {label} {key==='unread' && unreadCount>0 ? `(${unreadCount})` : ''}
          </button>
        ))}
      </div>

      <div className="space-y-2 max-w-2xl">
        {filtered.map((n, i) => {
          const s = typeStyle[n.type];
          return (
            <div key={i} onClick={() => markRead(i)}
              className={`bg-white rounded-xl border p-4 flex items-start gap-3 cursor-pointer transition-all hover:shadow-sm ${!n.read ? 'border-brand/20' : 'border-gray-100'}`}>
              <div className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center flex-shrink-0 ${s.icon}`}>
                {typeIcon[n.type]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold ${!n.read ? 'text-gray-800' : 'text-gray-600'}`}>{n.title}</p>
                  {!n.read && <span className={`w-2 h-2 rounded-full ${s.dot} flex-shrink-0`}/>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{n.text}</p>
                <p className="text-[11px] text-gray-400 mt-1">{n.time}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
