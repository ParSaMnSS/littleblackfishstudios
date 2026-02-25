// src/app/[locale]/projects/[slug]/page.tsx
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { YouTubeEmbed } from "@/components/YouTubeEmbed";

interface Props {
	params: Promise<{ slug: string; locale: string }>;
}

export default async function ProjectPage({ params }: Props) {
	const { slug, locale } = await params;
	const isRtl = locale === "fa";

	// 1. Fetch the exact project FIRST so we don't crash on unpublished previews
	const project = await prisma.project.findUnique({
		where: { slug },
	});

	if (!project) {
		notFound();
	}

	// 2. Fetch the project list to determine Next/Prev arrows (removed strict published filter)
	const allProjects = await prisma.project.findMany({
		orderBy: { order: "asc" },
		select: { id: true, slug: true, titleEn: true, titleFa: true },
	});

	const currentIndex = allProjects.findIndex((p) => p.slug === slug);

	// 3. Safely calculate adjacent projects
	const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
	const nextProject = currentIndex !== -1 && currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null;

	// 3. Localize Content
	const title = isRtl ? project.titleFa : project.titleEn;
	const description = isRtl ? project.descriptionFa : project.descriptionEn;

	return (
		<main className="relative min-h-screen bg-black px-4 py-20 text-white md:px-10">
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
						isRtl ? "flex-row-reverse" : ""
					}`}
				>
					<ArrowLeft
						className={isRtl ? "rotate-180" : ""}
						size={18}
					/>
					<span>
						{isRtl ? "بازگشت به پروژه‌ها" : "Back to Projects"}
					</span>
				</Link>

				{/* Video Section */}
				{project.youtubeUrl && (
					<div className="mb-10">
						<YouTubeEmbed url={project.youtubeUrl} />
					</div>
				)}

				{/* Text Content */}
				<div dir={isRtl ? "rtl" : "ltr"} className="space-y-6">
					<h1 className="text-4xl font-bold md:text-5xl">{title}</h1>

					<div className="h-1 w-20 bg-blue-500/50"></div>

					<p className="whitespace-pre-wrap text-lg leading-relaxed text-gray-300">
						{description}
					</p>
				</div>

				{/* Mobile & Bottom Navigation Footer */}
				<div className="mt-20 border-t border-white/10 pt-10">
					<div className={`flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between ${isRtl ? "sm:flex-row-reverse" : ""}`}>
						{prevProject ? (
							<Link
								href={`/${locale}/projects/${prevProject.slug}`}
								className={`group flex flex-col gap-2 ${isRtl ? "items-end text-right" : "items-start text-left"}`}
							>
								<span className="text-xs uppercase tracking-widest text-zinc-500">
									{isRtl ? "پروژه قبلی" : "Previous Project"}
								</span>
								<div className={`flex items-center gap-2 text-white transition-colors group-hover:text-blue-400 ${isRtl ? "flex-row-reverse" : ""}`}>
									<ChevronLeft size={20} className={isRtl ? "rotate-180" : ""} />
									<span className="text-lg font-medium">{isRtl ? prevProject.titleFa : prevProject.titleEn}</span>
								</div>
							</Link>
						) : <div />}

						{nextProject ? (
							<Link
								href={`/${locale}/projects/${nextProject.slug}`}
								className={`group flex flex-col gap-2 ${isRtl ? "items-start text-left" : "items-end text-right"}`}
							>
								<span className="text-xs uppercase tracking-widest text-zinc-500">
									{isRtl ? "پروژه بعدی" : "Next Project"}
								</span>
								<div className={`flex items-center gap-2 text-white transition-colors group-hover:text-blue-400 ${isRtl ? "flex-row-reverse" : ""}`}>
									<span className="text-lg font-medium">{isRtl ? nextProject.titleFa : nextProject.titleEn}</span>
									<ChevronRight size={20} className={isRtl ? "rotate-180" : ""} />
								</div>
							</Link>
						) : <div />}
					</div>
				</div>
			</div>
		</main>
	);
}
