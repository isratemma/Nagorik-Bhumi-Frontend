'use client';
import { useState } from 'react';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

const faqs = [
  { q: 'How do I add a new land record?',          a: 'Go to My Land Records and click "Add New Record". Fill in the land details and upload a photo and required documents like the deed and survey map.' },
  { q: 'How long does a mutation application take?', a: 'Mutation applications typically take 30–45 working days after submission of all required documents.' },
  { q: 'What documents are required for inheritance?', a: 'You need the death certificate of the deceased, NID copies of all heirs, original land deed, and a succession certificate.' },
  { q: 'How do I pay land tax online?',             a: 'Go to Land Tax section, select the property, and click "Pay Now". You can pay via bKash, Nagad, or bank transfer.' },
  { q: 'Can I download my verified documents?',     a: 'Yes, go to Documents section and click "Download" next to any verified document.' },
  { q: 'What is a Katha?',                          a: '1 Katha = 720 square feet in Bangladesh. It is a commonly used unit of land measurement.' },
  { q: 'How do I edit a land record?',              a: 'Go to My Land Records, click "Edit" on any record card, update the details or photo, and click "Save Changes".' },
  { q: 'Can I delete a land record?',               a: 'Yes. Go to My Land Records and click the "Delete" button on any record card. You will be asked to confirm before deletion.' },
];

export default function HelpPage() {
  const { t } = useLanguage();
  const [open,   setOpen]   = useState(null);
  const [ticket, setTicket] = useState({ subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent,   setSent]   = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!ticket.subject.trim()) { toast.error('Please enter a subject'); return; }
    if (!ticket.message.trim()) { toast.error('Please enter a message'); return; }
    setSending(true);
    // Simulate API — replace with real endpoint when backend is ready
    await new Promise(r => setTimeout(r, 1000));
    setSending(false);
    setSent(true);
    toast.success("Ticket submitted! We'll respond within 24 hours.");
    setTicket({ subject: '', message: '' });
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-800">{t.helpTitle}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{t.helpSubtitle}</p>
      </div>

      {/* Contact cards */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { icon:'📞', label:'Call Us',    value:'16789',                          sub:'Mon–Sat, 9am–6pm',     onClick: () => { window.open('tel:16789'); toast.info('Calling 16789…'); } },
          { icon:'✉️', label:'Email',      value:'support@nagorikbhumi.gov.bd',    sub:'Response within 24hrs', onClick: () => window.open('mailto:support@nagorikbhumi.gov.bd') },
          { icon:'💬', label:'Live Chat',  value:'Start Chat',                     sub:'Available now',         onClick: () => { toast.info('Live chat opening…'); window.open('mailto:support@nagorikbhumi.gov.bd?subject=Live+Chat+Request'); } },
        ].map((c, i) => (
          <button key={i} onClick={c.onClick}
            className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 hover:shadow-sm hover:border-brand/20 transition-all text-left w-full group">
            <div className="w-12 h-12 bg-brand-light group-hover:bg-brand/10 rounded-xl flex items-center justify-center text-2xl transition-colors">{c.icon}</div>
            <div>
              <p className="text-xs text-gray-500">{c.label}</p>
              <p className="font-semibold text-sm mt-0.5 text-brand group-hover:underline">{c.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.sub}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">

        {/* FAQs */}
        <div>
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {t.faqTitle}
          </h2>
          <div className="space-y-2">
            {faqs.map((f, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl overflow-hidden">
                <button onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-medium text-gray-800 pr-2">{f.q}</span>
                  <svg className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${open === i ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </button>
                {open === i && (
                  <div className="px-4 pb-4 border-t border-gray-50">
                    <p className="text-xs text-gray-600 pt-3 leading-relaxed">{f.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Ticket form */}
        <div>
          <h2 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            {t.ticketTitle}
          </h2>
          <div className="bg-white border border-gray-100 rounded-xl p-5">
            {sent && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                Ticket submitted! We'll get back to you within 24 hours.
              </div>
            )}
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">{t.subject} <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={ticket.subject}
                  onChange={e => setTicket({ ...ticket, subject: e.target.value })}
                  placeholder="Brief description of your issue"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Message <span className="text-red-500">*</span></label>
                <textarea
                  rows={5}
                  value={ticket.message}
                  onChange={e => setTicket({ ...ticket, message: e.target.value })}
                  placeholder="Describe your issue in detail..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand resize-none"
                />
              </div>
              <button type="submit" disabled={sending}
                className="w-full bg-brand hover:bg-brand-dark text-white text-sm font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {sending
                  ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>Sending…</>
                  : <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>{t.sendTicket}</>}
              </button>
            </form>
          </div>

          {/* Quick links */}
          <div className="mt-4 bg-brand-light rounded-xl border border-brand/10 p-4">
            <p className="text-xs font-semibold text-gray-700 mb-3">{t.quickLinks}</p>
            <div className="space-y-2">
              {[
                { label:'Add a Land Record',    href:'/dashboard/land-records/new' },
                { label:'Submit an Application',href:'/dashboard/applications/new' },
                { label:'Pay Land Tax',          href:'/dashboard/land-tax' },
                { label:'Upload Documents',      href:'/dashboard/documents' },
              ].map((l,i) => (
                <a key={i} href={l.href}
                  className="flex items-center justify-between text-xs font-medium text-brand hover:text-brand-dark transition-colors">
                  {l.label}
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/></svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
