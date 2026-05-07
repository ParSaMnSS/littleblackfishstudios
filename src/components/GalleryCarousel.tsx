'use client';

import { useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface GalleryCarouselProps {
  galleryUrls: string[];
  title: string;
  isRtl: boolean;
}

export default function GalleryCarousel({ galleryUrls, title, isRtl }: GalleryCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(galleryUrls.length > 1);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const item = el.firstElementChild as HTMLElement | null;
    const itemWidth = item ? item.offsetWidth + 16 : el.clientWidth;
    el.scrollBy({ left: dir === 'left' ? -itemWidth : itemWidth, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-6 scrollbar-hide"
      >
        {galleryUrls.map((url: string, index: number) => (
          <div
            key={url}
            className="relative min-w-[85%] md:min-w-[75%] aspect-video snap-center rounded-2xl overflow-hidden bg-zinc-900 shadow-xl border border-white/5 shrink-0"
          >
            <Image
              src={url}
              alt={`${title} - Gallery Image ${index + 1}`}
              fill
              sizes="(max-width: 768px) 85vw, 75vw"
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {galleryUrls.length > 1 && (
        <>
          <button
            onClick={() => scroll('left')}
            className={`absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110 ${
              canScrollLeft ? 'opacity-100' : 'opacity-30 cursor-default'
            }`}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll('right')}
            className={`absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-black/60 p-2 text-white backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110 ${
              canScrollRight ? 'opacity-100' : 'opacity-30 cursor-default'
            }`}
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      <div
        className={`flex items-center gap-2 text-[10px] uppercase tracking-widest text-zinc-500 mt-2 ${
          isRtl ? 'flex-row-reverse' : ''
        }`}
      >
        <Info size={12} className="text-blue-500" />
        <span>
          {isRtl
            ? 'برای مشاهده تصاویر بیشتر به طرفین بکشید'
            : 'Swipe/Scroll for more images'}
        </span>
      </div>
    </div>
  );
}
