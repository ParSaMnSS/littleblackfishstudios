export interface Project {
  id: string;
  slug: string;
  youtubeUrl?: string | null;
  imageUrl?: string | null;
  published: boolean;
  titleEn: string;
  titleFa: string;
  descriptionEn?: string | null;
  descriptionFa?: string | null;
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
