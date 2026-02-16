// src/app/[locale]/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

interface Props {
  params: Promise<{ slug: string; locale: string }>;
}

export default async function ProjectPage({ params }: Props) {
  const { slug, locale } = await params;
  const isRtl = locale === "fa";

  // 1. Fetch the project by slug
  const project = await prisma.project.findUnique({
    where: { slug },
  });

  // 2. Security Check: If not found or hidden, show 404
  if (!project || !project.published) {
    notFound();
  }

  // 3. Localize Content
  const title = isRtl ? project.titleFa : project.titleEn;
  const description = isRtl ? project.descFa : project.descEn;

  return (
    <main className="min-h-screen bg-black px-4 py-20 text-white md:px-10">
      <div className="mx-auto max-w-4xl">
        
        {/* Back Button */}
        <Link
          href={`/${locale}`}
          className={`group mb-8 inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-gray-300 transition-colors hover:bg-white/10 hover:text-white ${
            isRtl ? "flex-row-reverse" : ""
          }`}
        >
          <ArrowLeft
            className={`transition-transform group-hover:-translate-x-1 ${
              isRtl ? "rotate-180 group-hover:translate-x-1" : ""
            }`}
            size={18}
          />
          <span>{isRtl ? "بازگشت به پروژه‌ها" : "Back to Projects"}</span>
        </Link>

        {/* Video Section */}
        <div className="mb-10">
          <YouTubeEmbed url={project.youtubeUrl} />
        </div>

        {/* Text Content */}
        <div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
          <h1 className="text-4xl font-bold md:text-5xl">{title}</h1>
          
          <div className="h-1 w-20 bg-blue-500/50"></div>
          
          <p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-300">
            {description}
          </p>

          {/* Metadata */}
          <div className="mt-8 flex gap-4 text-sm text-gray-500">
            <span>Slug: {project.slug}</span>
            <span>•</span>
            <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

      </div>
    </main>
  );
}
