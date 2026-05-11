import { createServiceClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AdminDashboard from '@/components/Admin/AdminDashboard';
import { serializeProject, serializeHeroSlide, serializeCategory } from '@/lib/serializers';

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;

  if (!['en', 'fa'].includes(locale)) {
    notFound();
  }

  const supabase = createServiceClient();

  const [{ data: projectRows }, { data: slideRows }, { data: categoryRows }] = await Promise.all([
    supabase.from('projects').select('*').order('order', { ascending: true }),
    supabase.from('hero_slides').select('*').order('order', { ascending: true }),
    supabase.from('categories').select('*').order('order', { ascending: true }),
  ]);

  const projects = (projectRows ?? []).map(serializeProject);
  const heroSlides = (slideRows ?? []).map(serializeHeroSlide);
  const categories = (categoryRows ?? []).map(serializeCategory);

  return (
    <div className="min-h-screen bg-linear-to-b from-black via-zinc-950 to-black text-white p-4 md:p-10">
      <AdminDashboard
        initialProjects={projects}
        initialHeroSlides={heroSlides}
        initialCategories={categories}
        locale={locale}
      />
    </div>
  );
}
