'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    const segments = pathname.split('/');
    // segments[0] is empty, segments[1] is the locale
    const currentLocale = segments[1];
    const newLocale = currentLocale === 'en' ? 'fa' : 'en';
    
    segments[1] = newLocale;
    const newPath = segments.join('/');
    
    router.push(newPath);
  };

  const currentLocale = pathname.split('/')[1];

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-6 right-6 z-50 rounded-full bg-white px-4 py-2 text-sm font-bold text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
    >
      {currentLocale === 'en' ? 'FA' : 'EN'}
    </button>
  );
}
