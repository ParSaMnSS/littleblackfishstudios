export interface Project {
  id: string;
  slug: string;
  youtubeUrl: string;
  image?: string | null;
  published: boolean;
  titleEn: string;
  titleFa: string;
  descEn: string;
  descFa: string;
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
