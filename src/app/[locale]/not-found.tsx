'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function NotFound() {
  const params = useParams();
  const locale = (params?.locale as 'en' | 'fa') || 'en';
  const isRtl = locale === 'fa';

  const copy = isRtl
    ? {
        title: 'صفحه پیدا نشد',
        body: 'صفحه‌ای که دنبالش هستید وجود ندارد یا منتقل شده است.',
        home: 'صفحه اصلی',
        contact: 'تماس با ما',
      }
    : {
        title: 'Page not found',
        body: "The page you're looking for doesn't exist or has been moved.",
        home: 'Go home',
        contact: 'Contact us',
      };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-white"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <p className="text-[12vw] font-black leading-none tracking-tighter text-zinc-900 select-none">
        404
      </p>
      <div className="-mt-4 text-center">
        <h1 className="text-3xl font-black tracking-tight md:text-5xl">{copy.title}</h1>
        <p className="mt-3 text-zinc-500">{copy.body}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href={`/${locale}`}
            className="rounded-full bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-zinc-200"
          >
            {copy.home}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="rounded-full border border-zinc-800 px-6 py-3 text-sm font-black uppercase tracking-widest text-zinc-400 transition-all hover:border-zinc-600 hover:text-white"
          >
            {copy.contact}
          </Link>
        </div>
      </div>
    </div>
  );
}
