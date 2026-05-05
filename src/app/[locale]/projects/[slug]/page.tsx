import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createServerClient } from '@/lib/supabase/server';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import GalleryCarousel from '@/components/GalleryCarousel';
import { serializeProject } from '@/lib/serializers';

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { slug, locale } = await params;
  const isRtl = locale === 'fa';

  const supabase = await createServerClient();

  // 1. Fetch the single project; RLS filters out unpublished rows
  const { data: row } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (!row) notFound();

  const project = serializeProject(row);

  // 2. Fetch navigation list (minimal columns)
  const { data: navRows } = await supabase
    .from('projects')
    .select('id, slug, title_en, title_fa')
    .eq('published', true)
    .order('order', { ascending: true });

  const allProjects = (navRows ?? []).map((r) => ({
    id: r.id as string,
    slug: r.slug as string,
    titleEn: r.title_en as string,
    titleFa: r.title_fa as string,
  }));

  const currentIndex = allProjects.findIndex((p) => p.slug === slug);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject =
    currentIndex !== -1 && currentIndex < allProjects.length - 1
      ? allProjects[currentIndex + 1]
      : null;

  const title = isRtl ? project.titleFa : project.titleEn;
  const description = isRtl ? project.descriptionFa : project.descriptionEn;

  return (
    <main className="relative min-h-screen bg-black px-4 py-20 text-white md:px-10 overflow-x-hidden">
      {/* Desktop Floating Navigation */}
      {prevProject && (
        <Link
          href={`/${locale}/projects/${prevProject.slug}`}
          className="fixed left-8 top-1/2 z-40 hidden -translate-y-1/2 rounded-full bg-white/5 p-4 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-110 md:flex"
          title={isRtl ? prevProject.titleFa : prevProject.titleEn}
        >
          <ChevronLeft size={32} />
        </Link>
      )}

      {nextProject && (
        <Link
          href={`/${locale}/projects/${nextProject.slug}`}
          className="fixed right-8 top-1/2 z-40 hidden -translate-y-1/2 rounded-full bg-white/5 p-4 text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20 hover:scale-110 md:flex"
          title={isRtl ? nextProject.titleFa : nextProject.titleEn}
        >
          <ChevronRight size={32} />
        </Link>
      )}

      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <Link
          href={`/${locale}`}
          className={`relative z-50 pointer-events-auto cursor-pointer inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white mb-8 ${
            isRtl ? 'flex-row-reverse' : ''
          }`}
        >
          <ArrowLeft className={isRtl ? 'rotate-180' : ''} size={18} />
          <span>{isRtl ? 'بازگشت به پروژه‌ها' : 'Back to Projects'}</span>
        </Link>

        {/* Media Section */}
        <section className="mb-12">
          {project.mediaType === 'youtube' && project.youtubeUrl ? (
            <div className="shadow-2xl shadow-blue-500/10">
              <YouTubeEmbed url={project.youtubeUrl} />
            </div>
          ) : project.mediaType === 'gallery' && project.galleryUrls.length > 0 ? (
            <GalleryCarousel
              galleryUrls={project.galleryUrls}
              title={title ?? ''}
              isRtl={isRtl}
            />
          ) : project.youtubeUrl ? (
            <YouTubeEmbed url={project.youtubeUrl} />
          ) : (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 shadow-xl">
              {project.imageUrl && (
                <Image
                  src={project.imageUrl}
                  alt={title ?? ''}
                  fill
                  className="object-cover opacity-50 grayscale"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              )}
            </div>
          )}
        </section>

        {/* Text Content */}
        <article dir={isRtl ? 'rtl' : 'ltr'} className="space-y-6">
          <h1 className="text-4xl font-bold md:text-6xl tracking-tight leading-tight text-white">
            {title}
          </h1>
          <div className="h-1.5 w-24 bg-linear-to-r from-blue-600 to-blue-600/20 rounded-full"></div>
          <p className="whitespace-pre-wrap text-lg md:text-xl leading-relaxed text-zinc-400 font-light">
            {description}
          </p>
        </article>

        {/* Mobile & Bottom Navigation Footer */}
        <nav className="mt-24 border-t border-white/10 pt-12">
          <div
            className={`flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between ${
              isRtl ? 'sm:flex-row-reverse' : ''
            }`}
          >
            {prevProject ? (
              <Link
                href={`/${locale}/projects/${prevProject.slug}`}
                className={`group flex flex-col gap-3 transition-opacity hover:opacity-80 ${
                  isRtl ? 'items-end text-right' : 'items-start text-left'
                }`}
              >
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold">
                  {isRtl ? 'پروژه قبلی' : 'Previous'}
                </span>
                <div
                  className={`flex items-center gap-3 text-white transition-transform group-hover:translate-x-${
                    isRtl ? '1' : '-1'
                  } ${isRtl ? 'flex-row-reverse' : ''}`}
                >
                  <ChevronLeft
                    size={24}
                    className={`${isRtl ? 'rotate-180' : ''} text-blue-500`}
                  />
                  <span className="text-xl font-semibold">
                    {isRtl ? prevProject.titleFa : prevProject.titleEn}
                  </span>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {nextProject ? (
              <Link
                href={`/${locale}/projects/${nextProject.slug}`}
                className={`group flex flex-col gap-3 transition-opacity hover:opacity-80 ${
                  isRtl ? 'items-start text-left' : 'items-end text-right'
                }`}
              >
                <span className="text-xs uppercase tracking-[0.2em] text-zinc-500 font-bold">
                  {isRtl ? 'پروژه بعدی' : 'Next'}
                </span>
                <div
                  className={`flex items-center gap-3 text-white transition-transform group-hover:translate-x-${
                    isRtl ? '-1' : '1'
                  } ${isRtl ? 'flex-row-reverse' : ''}`}
                >
                  <span className="text-xl font-semibold">
                    {isRtl ? nextProject.titleFa : nextProject.titleEn}
                  </span>
                  <ChevronRight
                    size={24}
                    className={`${isRtl ? 'rotate-180' : ''} text-blue-500`}
                  />
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </nav>
      </div>
    </main>
  );
}
