'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { sendContactEmail } from '@/actions/contact';
import { Loader2, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ContactPage() {
  const t = useTranslations('Contact');
  const params = useParams();
  const locale = params?.locale as string;
  const isRtl = locale === 'fa';
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');

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
      setErrorMsg(result.error ?? 'Unknown error');
    }
    setLoading(false);

    setTimeout(() => setStatus('idle'), 5000);
  }

  const title = isRtl ? 'شروع پروژه' : 'Start a Project';
  const btnText = isRtl ? 'ارسال پیشنهاد' : 'Send Proposal';
  const phoneLabel = isRtl ? 'شماره تماس' : 'Phone';
  const detailsLabel = isRtl ? 'جزئیات پروژه' : 'Project Details';

  const inputCls =
    'w-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 text-white placeholder:text-zinc-700 focus:border-white focus:outline-none transition-all';
  const labelCls =
    'text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 ml-1';

  return (
    <div className="min-h-screen bg-black pt-44 pb-20 px-6">
      <div className="mx-auto max-w-2xl">
        <div
          className="space-y-12 motion-safe:animate-[fadeUp_0.8s_ease-out_both]"
          style={{
            // inline keyframes via Tailwind v4 are awkward; use a tiny CSS animation
            animation: 'fadeUp 0.8s ease-out both',
          }}
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
                <label className={labelCls}>{t('name')}</label>
                <input name="name" type="text" required autoComplete="name" className={inputCls} />
              </div>
              <div className="space-y-3">
                <label className={labelCls}>{t('email')}</label>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={inputCls}
                />
              </div>
              <div className="space-y-3 md:col-span-2">
                <label className={labelCls}>{phoneLabel}</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+1 555 000 0000"
                  className={inputCls}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className={labelCls}>{detailsLabel}</label>
              <textarea
                name="message"
                required
                rows={6}
                className={`${inputCls} resize-none`}
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

          {status !== 'idle' && (
            <div
              key={status}
              className={`flex items-center gap-4 rounded-xl p-6 border ${
                status === 'success'
                  ? 'border-green-500/20 bg-green-500/10 text-green-500'
                  : 'border-red-500/20 bg-red-500/10 text-red-500'
              }`}
              style={{ animation: 'fadeUp 0.25s ease-out both' }}
            >
              {status === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
              <div>
                <p className="font-bold uppercase tracking-widest">
                  {status === 'success' ? t('success') : t('error')}
                </p>
                {status === 'error' && errorMsg && (
                  <p className="text-xs mt-1 opacity-70 font-mono">{errorMsg}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
