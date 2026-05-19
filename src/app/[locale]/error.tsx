'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = (params?.locale as 'en' | 'fa') || 'en';
  const isRtl = locale === 'fa';

  useEffect(() => {
    console.error(error);
  }, [error]);

  const copy = isRtl
    ? {
        title: 'مشکلی پیش آمد',
        body: 'یک خطای غیرمنتظره رخ داد. لطفاً دوباره تلاش کنید یا اگر ادامه داشت با ما تماس بگیرید.',
        retry: 'تلاش مجدد',
        home: 'صفحه اصلی',
      }
    : {
        title: 'Something went wrong',
        body: 'An unexpected error occurred. Please try again or contact us if it persists.',
        retry: 'Try again',
        home: 'Go home',
      };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-white"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <p className="text-[12vw] font-black leading-none tracking-tighter text-zinc-900 select-none">
        500
      </p>
      <div className="-mt-4 text-center">
        <h1 className="text-3xl font-black tracking-tight md:text-5xl">{copy.title}</h1>
        <p className="mt-3 text-zinc-500">{copy.body}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-full bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-zinc-200"
          >
            {copy.retry}
          </button>
          <Link
            href={`/${locale}`}
            className="rounded-full border border-zinc-800 px-6 py-3 text-sm font-black uppercase tracking-widest text-zinc-400 transition-all hover:border-zinc-600 hover:text-white"
          >
            {copy.home}
          </Link>
        </div>
      </div>
    </div>
  );
}
