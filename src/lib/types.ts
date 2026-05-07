export interface Project {
  id: string;
  slug: string;
  youtube_url: string | null;
  image_url: string | null;
  media_type: string;
  gallery_urls: string[];
  published: boolean;
  title_en: string;
  title_fa: string;
  description_en: string | null;
  description_fa: string | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface HeroSlide {
  id: string;
  title_en: string | null;
  title_fa: string | null;
  subtitle_en: string | null;
  subtitle_fa: string | null;
  image_url: string | null;
  youtube_url: string | null;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// Serialized (camelCase) shapes returned by serializers — used by components and client code

export interface SerializedProject {
  id: string;
  slug: string;
  youtubeUrl: string | null;
  imageUrl: string | null;
  mediaType: string;
  galleryUrls: string[];
  published: boolean;
  titleEn: string;
  titleFa: string;
  descriptionEn: string | null;
  descriptionFa: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SerializedHeroSlide {
  id: string;
  titleEn: string | null;
  titleFa: string | null;
  subtitleEn: string | null;
  subtitleFa: string | null;
  imageUrl: string | null;
  youtubeUrl: string | null;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
