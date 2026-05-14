import Image from 'next/image';

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-6">
        <div className="relative size-12 animate-pulse">
          <Image
            src="/logo-icon-white.png"
            fill
            sizes="48px"
            alt="Loading"
            className="object-contain opacity-40"
          />
        </div>
        <div className="h-px w-32 overflow-hidden bg-zinc-900">
          <div className="h-full w-full animate-[shimmer_1.5s_ease-in-out_infinite] bg-linear-to-r from-transparent via-zinc-600 to-transparent" />
        </div>
      </div>
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
