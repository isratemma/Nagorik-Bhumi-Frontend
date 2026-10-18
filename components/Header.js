'use client';

import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="flex items-center justify-between px-6 py-3 relative z-20 bg-white/60 backdrop-blur-sm border-b border-white/40">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Image
          src="/Logooo.png"
          alt="Nagorik Bhumi Logo"
          width={52}
          height={52}
          priority
          style={{ objectFit: 'contain' }}
        />
        <div>
          <div className="text-brand font-bold text-lg leading-tight">{t.brandName}</div>
          <div className="text-gray-500 text-xs">{t.tagline}</div>
        </div>
      </div>

      {/* Language switcher */}
      <nav className="flex items-center gap-2 text-sm">
        <button
          onClick={() => setLang('bn')}
          className={`font-medium transition-colors px-1 ${
            lang === 'bn' ? 'text-brand' : 'text-gray-500 hover:text-brand'
          }`}
        >
          {t.langBn}
        </button>
        <span className="text-gray-300">|</span>
        <button
          onClick={() => setLang('en')}
          className={`font-medium transition-colors px-1 ${
            lang === 'en' ? 'text-brand' : 'text-gray-500 hover:text-brand'
          }`}
        >
          {t.langEn}
        </button>
      </nav>
    </header>
  );
}
