'use client';
import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useLanguage } from '@/context/LanguageContext';

const cases = [
  { id:'INH-2024-001', property:'Residential Land – Savar, Dhaka',    deceased:'Mr. Rahim Uddin',   relation:'Father', share:'25%', status:'In Progress',       filed:'15 Jan 2024' },
  { id:'INH-2024-002', property:'Agricultural Land – Gazipur',         deceased:'Mrs. Rahela Begum', relation:'Mother', share:'33%', status:'Completed',          filed:'03 Apr 2024' },
  { id:'INH-2023-003', property:'Agricultural Land – Tangail',         deceased:'Mr. Karim Mia',     relation:'Uncle',  share:'12%', status:'Pending Documents',  filed:'20 Nov 2023' },
];

const statusStyle = {
  'In Progress':      'bg-blue-100 text-blue-700',
  'Completed':        'bg-green-100 text-green-700',
  'Pending Documents':'bg-yellow-100 text-yellow-700',
};

export default function InheritancePage() {
  const { t } = useLanguage();
  const [selected, setSelected] = useState(null);

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{t.inheritance}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{t.inheritSubtitle}</p>
        </div>
        <Link href="/dashboard/inheritance/new"
          className="bg-brand hover:bg-brand-dark text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
          {t.fileNewCase}
        </Link>
      </div>

      {/* Info */}
      <div className="bg-brand-light border border-brand/10 rounded-xl p-4 mb-6 flex items-start gap-3">
        <svg className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <p className="text-sm text-gray-600">
          Land inheritance cases are processed by the Sub-Registrar office. Upload required documents in the <Link href="/dashboard/documents" className="text-brand font-medium hover:underline">Documents</Link> section.
        </p>
      </div>

      {/* Cases */}
      <div className="space-y-4">
        {cases.map((c,i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-brand">{c.id}</span>
                  <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${statusStyle[c.status]}`}>{c.status}</span>
                </div>
                <h3 className="font-semibold text-gray-800">{c.property}</h3>
              </div>
              <div className="flex gap-2">
                {c.status === 'Pending Documents' && (
                  <Link href="/dashboard/documents"
                    className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5 rounded-lg transition-colors font-semibold flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                    Upload Docs
                  </Link>
                )}
                <button
                  onClick={() => setSelected(selected === i ? null : i)}
                  className="text-xs text-brand font-medium border border-brand/20 px-3 py-1.5 rounded-lg hover:bg-brand-light transition-colors">
                  {selected === i ? t.hide : t.viewCase}
                </button>
              </div>
            </div>

            {/* Expanded details */}
            {selected === i && (
              <div className="mt-4 pt-4 border-t border-gray-50">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label:'Deceased',          value: c.deceased },
                    { label:'Relation',           value: c.relation },
                    { label:'Inheritance Share',  value: c.share },
                    { label:'Filed On',           value: c.filed },
                  ].map((d,j) => (
                    <div key={j} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-400 mb-1">{d.label}</p>
                      <p className="text-sm font-semibold text-gray-800">{d.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => toast.info(`Case ${c.id} downloaded.`)}
                    className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                    Download Summary
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
