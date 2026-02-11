import React from 'react';
import { ProjectCardProps } from './types';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const ProjectCard: React.FC<ProjectCardProps> = ({ project, locale }) => {
  const isRtl = locale === 'fa';
  
  return (
    <div className={twMerge(
      "group overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950",
      isRtl ? "text-right" : "text-left"
    )}>
      <div className="aspect-video w-full bg-zinc-100 dark:bg-zinc-900">
        {/* Placeholder for YouTube Embed or Thumbnail */}
        <div className="flex h-full items-center justify-center text-zinc-400">
          YouTube Preview
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
          {isRtl ? project.titleFa : project.titleEn}
        </h3>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 line-clamp-2">
          {isRtl ? project.descFa : project.descEn}
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
