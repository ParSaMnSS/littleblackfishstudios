'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ locale }: { locale: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isRtl = locale === 'fa';

  // 3. Body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const segments = pathname.split('/');
    const currentLocale = segments[1];
    const newLocale = currentLocale === 'en' ? 'fa' : 'en';
    segments[1] = newLocale;
    window.location.href = segments.join('/');
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (pathname === `/${locale}` || pathname === `/${locale}/`) {
      const href = e.currentTarget.getAttribute('href');
      if (href?.includes('#projects')) {
        e.preventDefault();
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        setIsOpen(false);
      }
    }
  };

  const navLinks = [
    { href: `/${locale}/#projects`, label: isRtl ? 'پروژه‌ها' : 'Projects' },
    { href: `/${locale}/about`, label: isRtl ? 'درباره ما' : 'About' },
    { href: `/${locale}/contact`, label: isRtl ? 'تماس' : 'Contact' },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 h-24 flex items-center px-6 md:px-12 ${
          scrolled ? 'bg-black/90 backdrop-blur-md h-20' : 'bg-linear-to-b from-black/90 to-transparent'
        }`}
      >
        <div className="flex w-full items-center justify-between max-w-7xl mx-auto">
          {/* Logo */}
          <Link 
            href={`/${locale}`} 
            className={`font-lalezar text-white hover:opacity-80 transition-opacity ${
              isRtl ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'
            }`}
          >
            {isRtl ? 'استودیو ماهی سیاه کوچولو' : 'LBF Studios'}
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={link.href.includes('#projects') ? handleScroll : undefined}
                className={`font-black uppercase transition-colors ${
                  isRtl ? 'text-lg tracking-normal' : 'text-xs tracking-[0.3em] text-white/70 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
            >
              <Globe size={14} />
              {locale === 'en' ? 'FA' : 'EN'}
            </button>
          </div>

          {/* Mobile Toggle Button */}
          <button 
            className="md:hidden text-white p-2"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* 1. Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[9999] h-[100dvh] w-screen bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            {/* 2. Close Button inside the overlay */}
            <button 
              className="absolute top-6 right-6 p-4 text-white hover:opacity-70 transition-opacity"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X size={32} />
            </button>

            <div className="flex flex-col items-center gap-10 text-center">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={link.href.includes('#projects') ? (e) => { handleScroll(e); setIsOpen(false); } : () => setIsOpen(false)}
                  className={`font-black uppercase text-white transition-transform active:scale-95 ${
                    isRtl ? 'text-5xl tracking-normal' : 'text-4xl tracking-[0.2em]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <button
                onClick={() => {
                  toggleLanguage();
                  setIsOpen(false);
                }}
                className="mt-6 flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-5 text-sm font-black uppercase tracking-widest text-white hover:bg-white hover:text-black transition-all"
              >
                <Globe size={20} />
                {locale === 'en' ? 'Persian (FA)' : 'English (EN)'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
