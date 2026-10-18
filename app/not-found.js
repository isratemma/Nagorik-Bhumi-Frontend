import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <svg className="absolute bottom-0 left-0 w-64 opacity-10" viewBox="0 0 200 260" fill="none">
          <path d="M10 260 C10 200 40 140 20 80 C70 120 80 190 50 260Z" fill="#1a6b3c"/>
          <path d="M40 260 C35 195 70 130 55 60 C100 105 105 185 75 260Z" fill="#2d8a55"/>
        </svg>
        <svg className="absolute bottom-0 right-0 w-64 opacity-10" viewBox="0 0 200 260" fill="none">
          <path d="M190 260 C190 200 160 140 180 80 C130 120 120 190 150 260Z" fill="#1a6b3c"/>
          <path d="M160 260 C165 195 130 130 145 60 C100 105 95 185 125 260Z" fill="#2d8a55"/>
        </svg>
      </div>

      <div className="relative z-10 text-center max-w-md">
        {/* 404 graphic */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-8xl font-black text-brand opacity-20">4</span>
          <div className="w-24 h-24 rounded-2xl bg-brand-light border-2 border-brand/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
            </svg>
          </div>
          <span className="text-8xl font-black text-brand opacity-20">4</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved.<br/>
          Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/dashboard"
            className="w-full sm:w-auto bg-brand hover:bg-brand-dark text-white font-semibold px-6 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
            Go to Dashboard
          </Link>
          <Link href="/login"
            className="w-full sm:w-auto border border-brand text-brand font-semibold px-6 py-2.5 rounded-lg hover:bg-brand-light transition-colors flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/></svg>
            Back to Login
          </Link>
        </div>

        <p className="text-xs text-gray-400 mt-8">
          © 2024 <span className="font-medium text-brand">Nagorik Bhumi</span> · Land Services for a Better Bangladesh
        </p>
      </div>
    </div>
  );
}
