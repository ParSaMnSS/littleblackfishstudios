import { prisma } from "@/lib/prisma";
import { toggleProjectStatus } from "@/actions/admin";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/Admin/ProjectForm";
import HeroManager from "@/components/Admin/HeroManager";

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;

  if (!['en', 'fa'].includes(locale)) {
    notFound();
  }

  // Fetch data
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const heroSlides = await prisma.heroSlide.findMany({
    orderBy: { order: 'asc' },
  });

  const isRtl = locale === 'fa';

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 bg-black text-white min-h-screen">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-white mb-8">
          {isRtl ? 'پنل مدیریت کاگو' : 'KAGU Admin Panel'}
        </h1>
        
        {/* Section 1: Hero Management */}
        <div className="mb-20">
          <HeroManager initialSlides={heroSlides} locale={locale} />
        </div>

        <div className="h-px w-full bg-zinc-800 mb-20" />

        {/* Section 2: Project Management */}
        <div className="space-y-8">
          <h2 className="text-2xl font-bold">{isRtl ? 'مدیریت پروژه‌ها' : 'Project Management'}</h2>
          <ProjectForm locale={locale} />
        </div>
      </header>

      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900">
              <th className="p-4 font-semibold text-zinc-300">{isRtl ? 'عنوان' : 'Title'}</th>
              <th className="p-4 font-semibold text-zinc-300">{isRtl ? 'وضعیت' : 'Status'}</th>
              <th className="p-4 font-semibold text-zinc-300">{isRtl ? 'عملیات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-zinc-800/50 transition-colors">
                <td className="p-4 text-zinc-300">
                  {isRtl ? project.titleFa : project.titleEn}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    project.published 
                      ? 'bg-green-900/30 text-green-400' 
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {project.published 
                      ? (isRtl ? 'منتشر شده' : 'Published') 
                      : (isRtl ? 'پیش‌نویس' : 'Draft')}
                  </span>
                </td>
                <td className="p-4">
                  <form action={async () => {
                    'use server';
                    await toggleProjectStatus(project.id, project.published);
                  }}>
                    <button
                      type="submit"
                      className="text-sm font-medium text-blue-400 hover:text-blue-300"
                    >
                      {project.published 
                        ? (isRtl ? 'تغییر به پیش‌نویس' : 'Unpublish') 
                        : (isRtl ? 'انتشار' : 'Publish')}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-zinc-500">
                  {isRtl ? 'پروژه‌ای برای نمایش وجود ندارد.' : 'No projects found.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
