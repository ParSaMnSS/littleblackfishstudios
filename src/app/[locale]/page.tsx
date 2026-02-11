import { prisma } from "@/lib/prisma";
import Hero from "@/components/Hero/Hero";
import ProjectGrid from "@/components/ProjectGrid/ProjectGrid";
import { notFound } from "next/navigation";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  if (!['en', 'fa'].includes(locale)) {
    notFound();
  }

  // Fetch published projects from Prisma
  const projects = await prisma.project.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <Hero locale={locale} />
      
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            {locale === 'fa' ? 'پروژه‌های اخیر' : 'Recent Projects'}
          </h2>
        </header>
        
        <ProjectGrid projects={projects} locale={locale} />
        
        {projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-zinc-500">
              {locale === 'fa' ? 'هیچ پروژه‌ای یافت نشد.' : 'No projects found.'}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
