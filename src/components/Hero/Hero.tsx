'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [isPaused, setIsPaused] = useState(false);
  const isRtl = locale === 'fa';

  const handleNext = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Auto-play logic with interaction pause
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 8000);

    return () => clearInterval(timer);
  }, [slides.length, isPaused, handleNext]);

  // Pause timer for 10 seconds on interaction
  const triggerInteraction = () => {
    setIsPaused(true);
    const resumeTimer = setTimeout(() => {
      setIsPaused(false);
    }, 10000);
    return () => clearTimeout(resumeTimer);
  };

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
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 12, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={slides[current].imageUrl}
              alt={isRtl ? slides[current].titleFa : slides[current].titleEn}
              fill
              priority
              className="object-cover opacity-70"
            />
          </motion.div>

          {/* Refined Cinematic Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

          {/* Content Container */}
          <div className="relative flex h-full items-center justify-center px-6 text-center">
            <div className="max-w-6xl">
              <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
                className="space-y-6"
              >
                <h1 className={`font-black tracking-tighter text-white uppercase leading-none
                  ${isRtl ? 'text-5xl md:text-8xl' : 'text-6xl md:text-9xl'}`}
                >
                  {isRtl ? slides[current].titleFa : slides[current].titleEn}
                </h1>
                
                <div className="mx-auto h-1.5 w-32 bg-blue-600/90" />
                
                <p className="mx-auto max-w-2xl text-lg font-light tracking-wide text-zinc-300 md:text-2xl">
                  {isRtl ? slides[current].subtitleFa : slides[current].subtitleEn}
                </p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="pt-12"
                >
                  <button className="rounded-full border border-white/30 bg-white/5 px-10 py-4 text-xs font-black tracking-[0.3em] text-white backdrop-blur-md transition-all hover:bg-white hover:text-black">
                    {isRtl ? 'مشاهده پروژه‌ها' : 'EXPLORE WORK'}
                  </button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => { triggerInteraction(); handlePrev(); }}
            className="absolute left-6 top-1/2 z-40 -translate-y-1/2 rounded-full p-4 text-white/40 transition-all hover:bg-black/20 hover:text-white"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-12 w-12" />
          </button>
          <button
            onClick={() => { triggerInteraction(); handleNext(); }}
            className="absolute right-6 top-1/2 z-40 -translate-y-1/2 rounded-full p-4 text-white/40 transition-all hover:bg-black/20 hover:text-white"
            aria-label="Next slide"
          >
            <ChevronRight className="h-12 w-12" />
          </button>
        </>
      )}
      
      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 gap-4 z-40">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => { triggerInteraction(); setCurrent(index); }}
              className={`h-1 rounded-full transition-all duration-700 ${
                current === index ? 'w-16 bg-white' : 'w-4 bg-white/20'
              }`}
            />
          ))}
        </div>
      )}

      {/* Scroll Decorator */}
      <div className="absolute bottom-10 left-10 hidden md:block z-40">
         <div className="flex items-center gap-4 rotate-90 origin-left translate-y-24">
            <span className="text-[10px] font-black tracking-[0.5em] text-zinc-600 uppercase">Scroll to explore</span>
            <div className="h-px w-20 bg-zinc-800" />
         </div>
      </div>
    </div>
  );
};

export default Hero;
