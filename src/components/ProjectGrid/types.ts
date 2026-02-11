export interface Project {
  id: string;
  youtubeUrl: string;
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
