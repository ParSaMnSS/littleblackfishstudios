import type { Project, HeroSlide, SerializedProject, SerializedHeroSlide } from './types';

export function serializeProject(row: Project): SerializedProject {
  return {
    id: row.id,
    slug: row.slug,
    youtubeUrl: row.youtube_url ?? null,
    imageUrl: row.image_url ?? null,
    mediaType: row.media_type ?? 'youtube',
    galleryUrls: row.gallery_urls ?? [],
    published: row.published,
    titleEn: row.title_en,
    titleFa: row.title_fa,
    descriptionEn: row.description_en ?? null,
    descriptionFa: row.description_fa ?? null,
    order: row.order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function serializeHeroSlide(row: HeroSlide): SerializedHeroSlide {
  return {
    id: row.id,
    titleEn: row.title_en ?? null,
    titleFa: row.title_fa ?? null,
    subtitleEn: row.subtitle_en ?? null,
    subtitleFa: row.subtitle_fa ?? null,
    imageUrl: row.image_url ?? null,
    youtubeUrl: row.youtube_url ?? null,
    order: row.order,
    active: row.active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
