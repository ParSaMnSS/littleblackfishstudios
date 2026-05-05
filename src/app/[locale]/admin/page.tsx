import { createServiceClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import AdminDashboard from '@/components/Admin/AdminDashboard';
import { serializeProject, serializeHeroSlide } from '@/lib/serializers';

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;

  if (!['en', 'fa'].includes(locale)) {
    notFound();
  }

  const supabase = createServiceClient();

  const { data: projectRows } = await supabase
    .from('Project')
    .select('*')
    .order('order', { ascending: true });

  const { data: slideRows } = await supabase
    .from('HeroSlide')
    .select('*')
    .order('order', { ascending: true });

  const projects = (projectRows ?? []).map(serializeProject);
  const heroSlides = (slideRows ?? []).map(serializeHeroSlide);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10">
      <AdminDashboard
        initialProjects={projects}
        initialHeroSlides={heroSlides}
        locale={locale}
      />
    </div>
  );
}
