import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-white">
      <p className="text-[12vw] font-black leading-none tracking-tighter text-zinc-900 select-none">
        404
      </p>
      <div className="-mt-4 text-center">
        <h1 className="text-3xl font-black tracking-tight md:text-5xl">Page not found</h1>
        <p className="mt-3 text-zinc-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link
            href="/en"
            className="rounded-full bg-white px-6 py-3 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-zinc-200"
          >
            Go home
          </Link>
          <Link
            href="/en/contact"
            className="rounded-full border border-zinc-800 px-6 py-3 text-sm font-black uppercase tracking-widest text-zinc-400 transition-all hover:border-zinc-600 hover:text-white"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}
