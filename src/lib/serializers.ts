/* eslint-disable @typescript-eslint/no-explicit-any */

export function serializeProject(row: Record<string, any>) {
  return {
    id: row.id as string,
    slug: row.slug as string,
    youtubeUrl: (row.youtube_url ?? null) as string | null,
    imageUrl: (row.image_url ?? null) as string | null,
    mediaType: (row.media_type ?? 'youtube') as string,
    galleryUrls: (row.gallery_urls ?? []) as string[],
    published: row.published as boolean,
    titleEn: row.title_en as string,
    titleFa: row.title_fa as string,
    descriptionEn: (row.description_en ?? null) as string | null,
    descriptionFa: (row.description_fa ?? null) as string | null,
    order: row.order as number,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function serializeHeroSlide(row: Record<string, any>) {
  return {
    id: row.id as string,
    titleEn: (row.title_en ?? null) as string | null,
    titleFa: (row.title_fa ?? null) as string | null,
    subtitleEn: (row.subtitle_en ?? null) as string | null,
    subtitleFa: (row.subtitle_fa ?? null) as string | null,
    imageUrl: (row.image_url ?? null) as string | null,
    youtubeUrl: (row.youtube_url ?? null) as string | null,
    order: row.order as number,
    active: row.active as boolean,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}
