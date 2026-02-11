import { prisma } from "@/lib/prisma";
import { toggleProjectStatus } from "@/actions/admin";
import { notFound } from "next/navigation";

interface AdminPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale } = await params;

  if (!['en', 'fa'].includes(locale)) {
    notFound();
  }

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const isRtl = locale === 'fa';

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <header className="mb-12 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {isRtl ? 'پنل مدیریت' : 'Admin Panel'}
        </h1>
      </header>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-bottom border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
              <th className="p-4 font-semibold text-zinc-900 dark:text-zinc-50">{isRtl ? 'عنوان' : 'Title'}</th>
              <th className="p-4 font-semibold text-zinc-900 dark:text-zinc-50">{isRtl ? 'وضعیت' : 'Status'}</th>
              <th className="p-4 font-semibold text-zinc-900 dark:text-zinc-50">{isRtl ? 'عملیات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                <td className="p-4 text-zinc-700 dark:text-zinc-300">
                  {isRtl ? project.titleFa : project.titleEn}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    project.published 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
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
                      className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
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
