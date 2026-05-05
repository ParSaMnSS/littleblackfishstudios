export interface Project {
  id: string;
  slug: string;
  youtubeUrl?: string | null;
  imageUrl?: string | null;
  mediaType: string;
  galleryUrls: string[];
  published: boolean;
  titleEn: string;
  titleFa: string;
  descriptionEn?: string | null;
  descriptionFa?: string | null;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectGridProps {
  projects: Project[];
  locale: string;
}

export interface ProjectCardProps {
  project: Project;
  locale: string;
}
