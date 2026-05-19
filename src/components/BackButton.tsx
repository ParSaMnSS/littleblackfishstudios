'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

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
    if (window.history.length > 1 && document.referrer.includes(window.location.hostname)) {
      router.back();
    } else {
      router.push(fallback);
    }
  };

  // Nudge in the "back" direction: left for LTR, right for RTL.
  const nudgeX = isRtl ? 3 : -3;

  return (
    <motion.button
      onClick={handleClick}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white mb-8 ${
        isRtl ? 'flex-row-reverse' : ''
      }`}
    >
      <motion.span
        className="inline-flex"
        variants={{
          rest: { x: 0 },
          hover: { x: nudgeX, transition: { type: 'spring', stiffness: 400, damping: 22 } },
        }}
      >
        <ArrowLeft className={isRtl ? 'rotate-180' : ''} size={18} />
      </motion.span>
      <span>{label ?? defaultLabel}</span>
    </motion.button>
  );
}
