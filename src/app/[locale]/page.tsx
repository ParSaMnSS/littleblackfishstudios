import { createAnonClient } from '@/lib/supabase/server';
import Hero from '@/components/Hero/Hero';
import ProjectGrid from '@/components/ProjectGrid/ProjectGrid';
import { notFound } from 'next/navigation';
import { serializeProject, serializeHeroSlide } from '@/lib/serializers';
import type { Project, HeroSlide } from '@/lib/types';

export const revalidate = 3600;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!['en', 'fa'].includes(locale)) {
    notFound();
  }

  const supabase = createAnonClient();

  const [{ data: slideRows }, { data: projectRows }] = await Promise.all([
    supabase
      .from('hero_slides')
      .select('*')
      .eq('active', true)
      .order('order', { ascending: true }),
    supabase
      .from('projects')
      .select('*')
      .eq('published', true)
      .order('order', { ascending: true }),
  ]);

  const slides = ((slideRows ?? []) as unknown as HeroSlide[]).map(serializeHeroSlide);
  const projects = ((projectRows ?? []) as unknown as Project[]).map(serializeProject);

  return (
    <main className="min-h-screen bg-black">
      {/* Cinematic Hero Section */}
      <Hero slides={slides} locale={locale} />

      {/* Content Section */}
      <div id="projects" className="mx-auto max-w-7xl px-4 py-12 md:py-24 sm:px-6 lg:px-8 scroll-mt-24">
        <header className="mb-8 md:mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-px flex-1 bg-zinc-800"></div>
            <span className="text-xs font-bold tracking-[0.2em] text-blue-500 uppercase">
              {locale === 'fa' ? 'نمونه کارها' : 'Portfolio'}
            </span>
          </div>
          <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
            {locale === 'fa' ? 'پروژه‌های اخیر' : 'Recent Projects'}
          </h2>
        </header>

        <ProjectGrid projects={projects} locale={locale} />

        {projects.length === 0 && (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 font-light italic">
              {locale === 'fa' ? 'هیچ پروژه‌ای یافت نشد.' : 'No projects found in the archive.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
