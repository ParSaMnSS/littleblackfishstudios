'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { sendContactEmail } from '@/actions/contact';
import { Loader2, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';

export default function ContactPage() {
  const t = useTranslations('Contact');
  const params = useParams();
  const locale = params?.locale as string;
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setStatus('idle');

    const formData = new FormData(e.currentTarget);
    const result = await sendContactEmail(formData);

    if (result.success) {
      setStatus('success');
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus('error');
    }
    setLoading(false);

    // Reset status after 5 seconds
    setTimeout(() => setStatus('idle'), 5000);
  }

  const title = locale === 'fa' ? 'شروع پروژه' : 'Start a Project';
  const btnText = locale === 'fa' ? 'ارسال پیشنهاد' : 'Send Proposal';

  return (
    <div className="min-h-screen bg-black pt-44 pb-20 px-6">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter leading-none">
              {title}
            </h1>
            <div className="h-1.5 w-24 bg-blue-600" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                  {t('name')}
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-white placeholder:text-zinc-700 focus:border-white focus:outline-none transition-all"
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                  {t('email')}
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-white placeholder:text-zinc-700 focus:border-white focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1">
                {locale === 'fa' ? 'جزئیات پروژه' : 'Project Details'}
              </label>
              <textarea
                name="message"
                required
                rows={6}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-white placeholder:text-zinc-700 focus:border-white focus:outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full overflow-hidden rounded-xl bg-white py-6 font-black uppercase tracking-[0.3em] text-black transition-all hover:bg-zinc-200 disabled:opacity-50"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>{t('sending')}</span>
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    <span>{btnText}</span>
                  </>
                )}
              </div>
            </button>
          </form>

          <AnimatePresence>
            {status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center gap-4 rounded-xl p-6 border ${
                  status === 'success'
                    ? 'border-green-500/20 bg-green-500/10 text-green-500'
                    : 'border-red-500/20 bg-red-500/10 text-red-500'
                }`}
              >
                {status === 'success' ? (
                  <CheckCircle size={24} />
                ) : (
                  <AlertCircle size={24} />
                )}
                <p className="font-bold uppercase tracking-widest">
                  {status === 'success' ? t('success') : t('error')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
