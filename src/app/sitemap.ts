import { createServerClient } from '@/lib/supabase/server';
import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://littleblackfishstudios.com';
const LOCALES = ['en', 'fa'] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createServerClient();

  const { data: projects } = await supabase
    .from('projects')
    .select('slug, updated_at')
    .eq('published', true)
    .order('order', { ascending: true });

  const staticRoutes: MetadataRoute.Sitemap = LOCALES.flatMap((locale) => [
    { url: `${BASE_URL}/${locale}`, lastModified: new Date() },
    { url: `${BASE_URL}/${locale}/about`, lastModified: new Date() },
    { url: `${BASE_URL}/${locale}/contact`, lastModified: new Date() },
  ]);

  const projectRoutes: MetadataRoute.Sitemap = (projects ?? []).flatMap((p) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}/projects/${p.slug}`,
      lastModified: new Date(p.updated_at),
    }))
  );

  return [...staticRoutes, ...projectRoutes];
}
