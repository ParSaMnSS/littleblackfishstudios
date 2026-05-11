import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';
import { createAnonClient } from '@/lib/supabase/server';
import ProjectGrid from '@/components/ProjectGrid/ProjectGrid';
import {
  serializeCategory,
  serializeProject,
} from '@/lib/serializers';
import type { Category, Project } from '@/lib/types';

export const revalidate = 3600;

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const isRtl = locale === 'fa';
  const supabase = createAnonClient();

  const { data: row } = await supabase
    .from('categories')
    .select('name_en, name_fa, visible')
    .eq('slug', slug)
    .single();

  if (!row || row.visible === false) return {};

  const name = isRtl ? row.name_fa : row.name_en;
  return {
    title: `${name} | Little Black Fish Studios`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug, locale } = await params;
  if (!['en', 'fa'].includes(locale)) notFound();
  const isRtl = locale === 'fa';

  const supabase = createAnonClient();

  const { data: categoryRow } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('visible', true)
    .single();

  if (!categoryRow) notFound();

  const category = serializeCategory(categoryRow as unknown as Category);

  const { data: projectRows } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .eq('category_id', category.id)
    .order('order', { ascending: true });

  const projects = ((projectRows ?? []) as unknown as Project[]).map(
    serializeProject,
  );

  const name = isRtl ? category.nameFa : category.nameEn;

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-20 md:py-28 sm:px-6 lg:px-8">
        <Link
          href={`/${locale}#projects`}
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white mb-10 ${
            isRtl ? 'flex-row-reverse' : ''
          }`}
        >
          <ArrowLeft className={isRtl ? 'rotate-180' : ''} size={18} />
          <span>{isRtl ? 'بازگشت به پروژه‌ها' : 'Back to Projects'}</span>
        </Link>

        <header className="mb-12">
          <div className="mb-3 flex items-center gap-4">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-xs font-bold tracking-[0.2em] text-blue-500 uppercase">
              {isRtl ? 'دسته‌بندی' : 'Category'}
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            {name}
          </h1>
          <div className="mt-4 h-1 w-20 bg-blue-600/80" />
        </header>

        {projects.length > 0 ? (
          <ProjectGrid projects={projects} locale={locale} />
        ) : (
          <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 font-light italic">
              {isRtl
                ? 'هنوز پروژه‌ای در این دسته‌بندی منتشر نشده است.'
                : 'No projects published in this category yet.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
