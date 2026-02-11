'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface HeroSlide {
  id: string;
  titleEn: string;
  titleFa: string;
  subtitleEn: string;
  subtitleFa: string;
  imageUrl: string;
}

interface HeroProps {
  slides: HeroSlide[];
  locale: string;
}

const Hero: React.FC<HeroProps> = ({ slides, locale }) => {
  const [current, setCurrent] = useState(0);
  const isRtl = locale === 'fa';

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {/* Background Image with Ken Burns Effect */}
          <motion.div 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[current].imageUrl}
              alt={isRtl ? slides[current].titleFa : slides[current].titleEn}
              fill
              priority
              className="object-cover opacity-60"
            />
          </motion.div>

          {/* Cinematic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

          {/* Content Container */}
          <div className="relative flex h-full items-center justify-center px-6 text-center">
            <div className="max-w-6xl">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="space-y-4"
              >
                <h1 className={`font-black tracking-tighter text-white uppercase
                  ${isRtl ? 'text-5xl md:text-8xl' : 'text-6xl md:text-9xl'}`}
                >
                  {isRtl ? slides[current].titleFa : slides[current].titleEn}
                </h1>
                
                <div className="mx-auto h-1 w-24 bg-blue-600/80" />
                
                <p className="mx-auto max-w-2xl text-lg font-light tracking-wide text-zinc-300 md:text-2xl">
                  {isRtl ? slides[current].subtitleFa : slides[current].subtitleEn}
                </p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="pt-10"
                >
                  <button className="rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-bold tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black">
                    {isRtl ? 'مشاهده پروژه‌ها' : 'EXPLORE WORK'}
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-1 transition-all duration-500 ${
                current === index ? 'w-12 bg-white' : 'w-4 bg-white/30'
              }`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500 opacity-50"
      >
        <div className="h-10 w-[1px] bg-gradient-to-b from-white to-transparent" />
      </motion.div>
    </div>
  );
};

export default Hero;
