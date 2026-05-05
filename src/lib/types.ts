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
