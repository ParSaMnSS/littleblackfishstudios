import { createAnonClient } from "@/lib/supabase/server";
import Hero from "@/components/Hero/Hero";
import ProjectGrid from "@/components/ProjectGrid/ProjectGrid";
import CategoryCarouselSection from "@/components/ProjectGrid/CategoryCarouselSection";
import { notFound } from "next/navigation";
import type { Project, HeroSlide, Category } from "@/lib/types";
import {
	serializeProject,
	serializeHeroSlide,
	serializeCategory,
} from "@/lib/serializers";

export const revalidate = 3600;

interface HomePageProps {
	params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
	const { locale } = await params;

	if (!["en", "fa"].includes(locale)) {
		notFound();
	}

	const supabase = createAnonClient();

	const [
		{ data: slideRows },
		{ data: projectRows },
		{ data: categoryRows },
	] = await Promise.all([
		supabase
			.from("hero_slides")
			.select("*")
			.eq("active", true)
			.order("order", { ascending: true }),
		supabase
			.from("projects")
			.select("*")
			.eq("published", true)
			.order("order", { ascending: true }),
		supabase
			.from("categories")
			.select("*")
			.eq("visible", true)
			.order("order", { ascending: true }),
	]);

	const slides = ((slideRows ?? []) as unknown as HeroSlide[]).map(
		serializeHeroSlide,
	);
	const projects = ((projectRows ?? []) as unknown as Project[]).map(
		serializeProject,
	);
	const categories = ((categoryRows ?? []) as unknown as Category[]).map(
		serializeCategory,
	);

	const projectsByCategory = new Map<string, typeof projects>();
	for (const p of projects) {
		const key = p.categoryId ?? "__uncategorized__";
		const list = projectsByCategory.get(key) ?? [];
		list.push(p);
		projectsByCategory.set(key, list);
	}
	const uncategorized = projectsByCategory.get("__uncategorized__") ?? [];

	const hasAnyCategoryProjects = categories.some(
		(c) => (projectsByCategory.get(c.id) ?? []).length > 0,
	);

	return (
		<main className="min-h-screen bg-black">
			{/* Cinematic Hero Section */}
			<Hero slides={slides} locale={locale} />

			{/* Content Section */}
			<div
				id="projects"
				className="mx-auto max-w-7xl px-4 py-12 md:py-24 sm:px-6 lg:px-8 scroll-mt-28 md:scroll-mt-24"
			>
				<header className="mb-8 md:mb-16">
					<div className="flex items-center gap-4 mb-4">
						<div className="h-px flex-1 bg-zinc-800"></div>
						<span className="text-xs font-bold tracking-[0.2em] text-blue-500 uppercase">
							{locale === "fa" ? "نمونه کارها" : "Portfolio"}
						</span>
					</div>
					<h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
						{locale === "fa" ? "پروژه‌های اخیر" : "Recent Projects"}
					</h2>
				</header>

				{hasAnyCategoryProjects ? (
					<>
						{categories.map((category) => {
							const items = projectsByCategory.get(category.id) ?? [];
							if (items.length === 0) return null;
							return (
								<CategoryCarouselSection
									key={category.id}
									category={category}
									projects={items}
									locale={locale}
								/>
							);
						})}

						{uncategorized.length > 0 && (
							<section className="mb-12 md:mb-20">
								<header className="mb-4">
									<h3 className="text-2xl md:text-3xl font-black tracking-tight text-white">
										{locale === "fa" ? "سایر پروژه‌ها" : "Other Projects"}
									</h3>
									<div className="mt-2 h-0.5 w-12 bg-blue-600/80" />
								</header>
								<ProjectGrid projects={uncategorized} locale={locale} />
							</section>
						)}
					</>
				) : projects.length > 0 ? (
					<ProjectGrid projects={projects} locale={locale} />
				) : (
					<div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
						<p className="text-zinc-500 font-light italic">
							{locale === "fa"
								? "هیچ پروژه‌ای یافت نشد."
								: "No projects found in the archive."}
						</p>
					</div>
				)}
			</div>
		</main>
	);
}
