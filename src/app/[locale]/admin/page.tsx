import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AdminDashboard from "@/components/Admin/AdminDashboard";

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;

  if (!['en', 'fa'].includes(locale)) {
    notFound();
  }

  // Fetch data ordered by 'order'
  const projects = await prisma.project.findMany({
    orderBy: { order: 'asc' },
  });

  const heroSlides = await prisma.heroSlide.findMany({
    orderBy: { order: 'asc' },
  });

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
