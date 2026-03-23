'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

const content = {
  en: {
    header: "From Youthful Madness to Timeless Frames",
    year: "2007",
    acts: [
      {
        title: "Act I",
        text: "It all began in the cold winter of 2007; not in equipped studios, but in the heart of limitations. We pursued two distinct paths at Art and Soore Universities—one in Cinema, the other in Theater. Yet, our point of connection was always the same: a rebellious desire for storytelling."
      },
      {
        title: "Act II",
        text: "Years of trial and error, from analyzing frames in harsh locations to writing in challenging days, taught us how to pull imagery and narrative out of darkness. Geographical distance and differing experiences didn't hinder us; they expanded our worldview."
      },
      {
        title: "Act III",
        text: "Today, this studio is the result of that long journey. We build the deepest, most vivid images for the silver screen and animation. We turn rebellious dreams into professional reality."
      }
    ]
  },
  fa: {
    header: "از جنون جوانی تا قاب‌های ماندگار",
    year: "۱۳۸۶",
    acts: [
      {
        title: "پرده اول",
        text: "همه‌چیز از زمستان سرد ۱۳۸۶ شروع شد؛ نه در استودیوهای مجهز، بلکه در دل محدودیت‌ها. ما دو مسیر متفاوت را در دانشگاه‌های «هنر» و «سوره» (یکی در سینما و دیگری در تئاتر) طی کردیم، اما نقطه اتصالمان همیشه یک چیز بود: میل سرکش به روایتگری."
      },
      {
        title: "پرده دوم",
        text: "سال‌ها آزمون و خطا، از تحلیل قاب‌ها در لوکیشن‌های سخت تا نوشتن در روزهای پرچالش، به ما آموخت که چگونه از دل تاریکی، تصویر و قصه بیرون بکشیم. فاصله جغرافیایی جهان‌بینی ما را وسعت بخشید."
      },
      {
        title: "پرده سوم",
        text: "امروز، این استودیو حاصل همان مسیر طولانی است. تیمی که یاد گرفته است عمیق‌ترین و زنده‌ترین تصاویر را برای پرده سینما و جهان انیمیشن بسازد. ما اینجاییم تا رویاهای سرکش را به واقعیت تبدیل کنیم."
      }
    ]
  }
};

const WordByWordHeader = ({ text }: { text: string }) => {
  const words = text.split(' ');

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.h1
      className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-tight md:leading-none text-zinc-100"
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <motion.span variants={child} className="inline-block">
            {word}
          </motion.span>
          {' '}
        </React.Fragment>
      ))}
    </motion.h1>
  );
};

const ProjectedText = ({ text }: { text: string }) => {
  const words = text.split(' ');
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04 },
    },
  };

  const child = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.2, 0.65, 0.3, 0.9] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.p
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20%" }}
      className="text-2xl md:text-4xl lg:text-5xl font-light leading-relaxed md:leading-snug text-zinc-300"
    >
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <motion.span variants={child} className="inline-block">
            {word}
          </motion.span>
          {' '}
        </React.Fragment>
      ))}
    </motion.p>
  );
};

export default function AboutPage() {
  const params = useParams();
  const locale = (params?.locale as 'en' | 'fa') || 'en';
  const isRtl = locale === 'fa';
  const data = content[locale] || content['en'];

  return (
    <div 
      className="min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden relative selection:bg-zinc-800 selection:text-white" 
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Massive Background Typography */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.04, scale: 1 }}
          transition={{ duration: 3, ease: "easeOut" }}
          className="text-[40vw] font-black text-white select-none leading-none tracking-tighter"
        >
          {data.year}
        </motion.div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-40 pb-40">
        
        {/* Header Section */}
        <section className="min-h-[70vh] flex flex-col justify-center max-w-5xl">
          <WordByWordHeader text={data.header} />
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
            className={`h-[2px] w-32 bg-zinc-500 mt-12 ${isRtl ? 'origin-right' : 'origin-left'}`}
          />
        </section>

        {/* Narrative Acts */}
        <div className="space-y-40 md:space-y-64 mt-20">
          {data.acts.map((act, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row gap-8 md:gap-24 items-start ${
                  !isEven ? 'md:flex-row-reverse' : ''
                }`}
              >
                {/* Act Indicator */}
                <div className="w-full md:w-1/4 shrink-0 mt-2 md:mt-4">
                  <div className="sticky top-40">
                    <motion.div 
                      initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-20%" }}
                      transition={{ duration: 0.6 }}
                    >
                      <span className="text-zinc-500 font-bold tracking-widest uppercase text-sm md:text-base block mb-4">
                        {act.title}
                      </span>
                      <div className="h-px w-full bg-zinc-800" />
                    </motion.div>
                  </div>
                </div>

                {/* Act Content */}
                <div className="w-full md:w-3/4">
                  <ProjectedText text={act.text} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
