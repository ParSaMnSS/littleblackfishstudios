'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  locale: string;
  isRtl: boolean;
  label?: string;
  fallbackHref?: string;
}

export default function BackButton({ locale, isRtl, label, fallbackHref }: BackButtonProps) {
  const router = useRouter();
  const fallback = fallbackHref ?? `/${locale}`;
  const defaultLabel = isRtl ? 'بازگشت' : 'Back';

  const handleClick = () => {
    // If there's a previous page in the same session, go back
    if (window.history.length > 1 && document.referrer.includes(window.location.hostname)) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white mb-8 ${
        isRtl ? 'flex-row-reverse' : ''
      }`}
    >
      <ArrowLeft className={isRtl ? 'rotate-180' : ''} size={18} />
      <span>{label ?? defaultLabel}</span>
    </button>
  );
}
