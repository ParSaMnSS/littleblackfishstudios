'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';

export default function AboutPage() {
  const params = useParams();
  const locale = params?.locale as string;
  const isRtl = locale === 'fa';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const stats = [
    { 
      labelEn: '3+ Years', 
      labelFa: '۳+ سال تجربه', 
      valueEn: 'Experience', 
      valueFa: 'تجربه' 
    },
    { 
      labelEn: '10+ Projects', 
      labelFa: '۱۰+ پروژه', 
      valueEn: 'Delivered', 
      valueFa: 'انجام شده' 
    },
    { 
      labelEn: '100% Passion', 
      labelFa: '۱۰۰٪ اشتیاق', 
      valueEn: 'In Every Pixel', 
      valueFa: 'در هر پیکسل' 
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white pt-44 pb-20 px-6">
      <motion.div
        className="mx-auto max-w-5xl space-y-24"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.section variants={itemVariants} className="space-y-6">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            {isRtl ? 'ما استودیو ماهی سیاه هستیم' : 'We Are Little Black Fish'}
          </h1>
          <div className="h-1.5 w-32 bg-blue-600" />
        </motion.section>

        {/* Mission Section */}
        <motion.section variants={itemVariants} className="max-w-3xl">
          <p className="text-2xl md:text-4xl font-light leading-tight text-zinc-300 italic">
            {isRtl 
              ? '«شنا کردن خلاف جهت جریان آب برای خلق تجربه‌های دیجیتال منحصر‌به‌فرد»' 
              : '"Swimming against the current to create unique digital experiences."'}
          </p>
        </motion.section>

        {/* Stats Grid */}
        <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm space-y-2 transition-colors hover:border-blue-500/50"
            >
              <h3 className="text-3xl font-black text-white">
                {isRtl ? stat.labelFa : stat.labelEn}
              </h3>
              <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                {isRtl ? stat.valueFa : stat.valueEn}
              </p>
            </motion.div>
          ))}
        </motion.section>

        {/* Story Section */}
        <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-lg text-zinc-400 leading-relaxed">
            <p>
              {isRtl 
                ? 'داستان ما از یک ایده ساده شروع شد: اینکه هنر و تکنولوژی نباید از هم جدا باشند. ما با تیمی کوچک اما رویاهایی بزرگ شروع کردیم، درست مثل ماهی سیاه کوچولو که دنیای بزرگتر را جستجو می‌کرد.' 
                : 'Our journey began with a simple belief: that art and technology should be inseparable. We started small but with big dreams, much like the little black fish seeking the vast ocean.'}
            </p>
            <p>
              {isRtl 
                ? 'امروز ما با تمرکز بر جزئیات و استفاده از آخرین تکنولوژی‌ها، به کسب‌وکارها کمک می‌کنیم تا حضور دیجیتال متفاوتی داشته باشند. ما فقط کد نمی‌زنیم، ما تجربه می‌سازیم.' 
                : 'Today, we help businesses establish a powerful digital presence by focusing on the finest details and leveraging cutting-edge technologies. We don’t just write code; we build experiences.'}
            </p>
          </div>
          <div className="relative aspect-square rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center p-12">
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent" />
             <div className="text-center space-y-4">
                <div className="text-8xl font-black text-white/5 select-none">LBF</div>
                <p className="text-xs font-black uppercase tracking-[0.5em] text-blue-500">Established 2023</p>
             </div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
