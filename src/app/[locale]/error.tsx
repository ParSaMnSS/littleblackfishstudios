'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-white">
      <p className="text-[12vw] font-black leading-none tracking-tighter text-zinc-900 select-none">
        500
      </p>
      <div className="-mt-4 text-center">
        <h1 className="text-3xl font-black tracking-tight md:text-5xl">Something went wrong</h1>
        <p className="mt-3 text-zinc-500">
          An unexpected error occurred. Please try again or contact us if it persists.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="rounded-full bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-zinc-200"
          >
            Try again
          </button>
          <Link
            href="/en"
            className="rounded-full border border-zinc-800 px-6 py-3 text-sm font-black uppercase tracking-widest text-zinc-400 transition-all hover:border-zinc-600 hover:text-white"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
