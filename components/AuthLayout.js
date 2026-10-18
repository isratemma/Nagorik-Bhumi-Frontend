'use client';

import Header from './Header';

export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">

      {/* ── bg.png background ── */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: "url('/bg.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* slight white overlay so cards stay readable */}
        <div className="absolute inset-0" style={{ background: 'rgba(220,240,220,0.18)' }} />

        {/* ── Decorative leaves bottom-left ── */}
        <svg className="absolute bottom-0 left-0 w-52 opacity-75" viewBox="0 0 180 260" fill="none">
          <path d="M10 260 C10 220 30 170 20 110 C50 140 60 190 40 260 Z" fill="#2d7a2d"/>
          <path d="M10 220 C10 220 30 170 20 110" stroke="#1a5a1a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M35 260 C30 215 55 155 45 90 C80 125 85 180 60 260 Z" fill="#3a8a3a"/>
          <path d="M35 230 C35 230 55 175 45 90" stroke="#1a5a1a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M0 260 C5 225 18 180 10 125 C38 152 40 200 20 260 Z" fill="#4aaa4a" opacity="0.8"/>
          <path d="M60 260 C52 230 70 185 62 140 C88 162 88 210 72 260 Z" fill="#2d7a2d" opacity="0.7"/>
        </svg>

        {/* ── Decorative leaves bottom-right ── */}
        <svg className="absolute bottom-0 right-0 w-52 opacity-75" viewBox="0 0 180 260" fill="none">
          <path d="M170 260 C170 220 150 170 160 110 C130 140 120 190 140 260 Z" fill="#2d7a2d"/>
          <path d="M170 220 C170 220 150 170 160 110" stroke="#1a5a1a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M145 260 C150 215 125 155 135 90 C100 125 95 180 120 260 Z" fill="#3a8a3a"/>
          <path d="M145 230 C145 230 125 175 135 90" stroke="#1a5a1a" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M180 260 C175 225 162 180 170 125 C142 152 140 200 160 260 Z" fill="#4aaa4a" opacity="0.8"/>
          <path d="M120 260 C128 230 110 185 118 140 C92 162 92 210 108 260 Z" fill="#2d7a2d" opacity="0.7"/>
        </svg>

        {/* Birds silhouette */}
        <svg className="absolute opacity-30" style={{ top: '10%', left: '20%' }} viewBox="0 0 120 30" fill="none" width="100">
          <path d="M0 15 Q8 6 16 15 Q24 6 32 15" stroke="#1a4a20" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <path d="M50 10 Q57 3 64 10 Q71 3 78 10" stroke="#1a4a20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
          <path d="M90 18 Q95 13 100 18 Q105 13 110 18" stroke="#1a4a20" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
        </svg>
      </div>

      {/* ── Header ── */}
      <Header />

      {/* ── Page content ── */}
      <main className="flex-1 flex items-start justify-center px-4 py-6 relative z-10">
        {children}
      </main>
    </div>
  );
}
