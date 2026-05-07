export interface HeroSlide {
  id: string;
  titleEn: string | null;
  titleFa: string | null;
  subtitleEn: string | null;
  subtitleFa: string | null;
  imageUrl: string | null;
  youtubeUrl: string | null;
}

export interface HeroProps {
  slides: HeroSlide[];
  locale: string;
}
