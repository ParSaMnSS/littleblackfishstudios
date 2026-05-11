'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, ArrowLeft } from 'lucide-react';
import ProjectCard from './ProjectCard';
import type { SerializedProject, SerializedCategory } from '@/lib/types';

interface Props {
  category: SerializedCategory;
  projects: SerializedProject[];
  locale: string;
}

export default function CategoryCarouselSection({ category, projects, locale }: Props) {
  const isRtl = locale === 'fa';
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (projects.length === 0) return null;

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.85 * dir;
    el.scrollBy({ left: amount, behavior: 'smooth' });
  };

  const ViewAllArrow = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section className="mb-12 md:mb-20">
      <header className="mb-4 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            {isRtl ? category.nameFa : category.nameEn}
          </h3>
          <div className="mt-2 h-0.5 w-12 bg-blue-600/80" />
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/${locale}/category/${category.slug}`}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-zinc-800 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 transition-all hover:border-zinc-600 hover:text-white"
          >
            {isRtl ? 'مشاهده همه' : 'View All'}
            <ViewAllArrow size={14} />
          </Link>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => scrollBy(isRtl ? 1 : -1)}
              aria-label={isRtl ? 'بعدی' : 'Previous'}
              className="rounded-full border border-zinc-800 p-2 text-zinc-400 transition-all hover:border-zinc-600 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(isRtl ? -1 : 1)}
              aria-label={isRtl ? 'قبلی' : 'Next'}
              className="rounded-full border border-zinc-800 p-2 text-zinc-400 transition-all hover:border-zinc-600 hover:text-white disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </header>

      <div
        ref={scrollerRef}
        dir={isRtl ? 'rtl' : 'ltr'}
        className="flex snap-x snap-mandatory gap-4 md:gap-6 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="snap-start shrink-0 w-[80%] sm:w-[48%] lg:w-[32%]"
          >
            <ProjectCard project={project} locale={locale} />
          </div>
        ))}
      </div>

      <div className="sm:hidden mt-4">
        <Link
          href={`/${locale}/category/${category.slug}`}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-400 transition-all hover:border-zinc-600 hover:text-white"
        >
          {isRtl ? 'مشاهده همه' : 'View All'}
          <ViewAllArrow size={14} />
        </Link>
      </div>
    </section>
  );
}
