'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

export default function AboutPage() {
  const params = useParams();
  const locale = params?.locale as string;
  const isRtl = locale === 'fa';

  const chapters = [
    {
      year: '2007',
      titleEn: 'Born in Limitations',
      titleFa: 'تولد در محدودیت',
      bodyEn: 'It all began in the cold winter of 2007; not in equipped studios, but in the heart of limitations. We pursued two distinct paths at Art and Soore Universities—one in Cinema, the other in Theater. Yet, our point of connection was always the same: a rebellious desire for storytelling.',
      bodyFa: 'همه‌چیز از زمستان سرد ۱۳۸۶ شروع شد؛ نه در استودیوهای مجهز، بلکه در دل محدودیت‌ها. ما دو مسیر متفاوت را در دانشگاه‌های «هنر» و «سوره» (یکی در سینما و دیگری در تئاتر) طی کردیم، اما نقطه اتصالمان همیشه یک چیز بود: میل سرکش به روایتگری.',
    },
    {
      year: 'Evolution',
      titleEn: 'Trial by Fire',
      titleFa: 'آزمون و خطا',
      bodyEn: 'Years of analyzing frames in harsh locations taught us how to pull imagery out of darkness. Geographical distance and differing experiences didn\'t hinder us; they expanded our worldview.',
      bodyFa: 'سال‌ها آزمون و خطا، از تحلیل قاب‌ها در لوکیشن‌های سخت تا نوشتن در روزهای پرچالش، به ما آموخت که چگونه از دل تاریکی، تصویر و قصه بیرون بکشیم. فاصله جغرافیایی جهان‌بینی ما را وسعت بخشید.',
    },
    {
      year: 'Today',
      titleEn: 'Vivid Reality',
      titleFa: 'واقعیت ملموس',
      bodyEn: 'Today, this studio is the result of that evolution. We build the deepest, most vivid images for the silver screen and animation. We turn rebellious dreams into professional reality.',
      bodyFa: 'امروز، این استودیو حاصل همان مسیر طولانی است. تیمی که یاد گرفته است عمیق‌ترین و زنده‌ترین تصاویر را برای پرده سینما و جهان انیمیشن بسازد. ما اینجاییم تا رویاهای سرکش را به واقعیت تبدیل کنیم.',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-44 pb-32 px-6 overflow-hidden relative">
      {/* Huge Background Watermark */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden flex items-start justify-center pt-20">
         <div className="text-[25rem] md:text-[35rem] font-black text-white/5 select-none leading-none mix-blend-overlay">
           2007
         </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-32 relative z-10">
        
        {/* Hero Header */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative space-y-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6 max-w-4xl">
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none bg-linear-to-r from-white to-gray-500 bg-clip-text text-transparent">
                {isRtl ? 'از جنون جوانی تا قاب‌های ماندگار' : 'From Youthful Madness to Timeless Frames'}
              </h1>
              <div className="h-1.5 w-32 bg-blue-600" />
            </div>

            {/* Established Date Corner Box */}
            <div className="shrink-0 flex items-center justify-center p-6 md:p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm relative overflow-hidden">
               <div className="absolute inset-0 bg-linear-to-tr from-blue-600/10 to-transparent" />
               <div className="text-center relative z-10">
                  <div className="text-3xl md:text-4xl font-black text-white/10 select-none mb-2">LBF</div>
                  <p className="text-xs md:text-sm font-black uppercase tracking-[0.2em] text-blue-500">
                    {isRtl ? 'از ۱۳۸۶' : 'Since 2007'}
                  </p>
               </div>
            </div>
          </div>
        </motion.section>

        {/* Vertical Film Strip Timeline Layout */}
        <div className="space-y-32 md:space-y-48 pb-20">
          {chapters.map((chapter, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <motion.section
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`flex flex-col gap-8 md:gap-20 items-center ${
                  isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Visual Film Strip Element */}
                <div className="w-full md:w-1/2 aspect-video md:aspect-[4/3] bg-black p-4 relative flex items-center justify-center group shadow-2xl rounded-md ring-1 ring-zinc-800 shrink-0">
                   {/* Film strip edge markings effect (Left) */}
                   <div className="absolute left-0 top-0 bottom-0 w-4 flex flex-col justify-around py-4 z-10">
                     {[...Array(8)].map((_, i) => <div key={`l-${i}`} className="w-2 h-3 bg-white/70 mx-auto rounded-[1px]" />)}
                   </div>
                   {/* Film strip edge markings effect (Right) */}
                   <div className="absolute right-0 top-0 bottom-0 w-4 flex flex-col justify-around py-4 z-10">
                     {[...Array(8)].map((_, i) => <div key={`r-${i}`} className="w-2 h-3 bg-white/70 mx-auto rounded-[1px]" />)}
                   </div>
                   
                   {/* The screen (inner area) */}
                   <div className="w-full h-full bg-zinc-900 relative overflow-hidden rounded-sm flex items-center justify-center border border-zinc-800/50">
                     <div className="absolute inset-0 bg-linear-to-tr from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                     <span className="text-zinc-800 font-black text-6xl md:text-8xl tracking-tighter uppercase select-none group-hover:scale-110 transition-transform duration-700">
                       {chapter.year}
                     </span>
                   </div>
                </div>

                {/* Content */}
                <div className={`w-full md:w-1/2 space-y-6 text-center ${
                  isEven 
                    ? (isRtl ? 'md:text-right' : 'md:text-left') 
                    : (isRtl ? 'md:text-left' : 'md:text-right')
                }`}>
                  <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">
                    {isRtl ? chapter.titleFa : chapter.titleEn}
                  </h2>
                  <p className="text-xl md:text-2xl font-light leading-relaxed text-zinc-400">
                    {isRtl ? chapter.bodyFa : chapter.bodyEn}
                  </p>
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
