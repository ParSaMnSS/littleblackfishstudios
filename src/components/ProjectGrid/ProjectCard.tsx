import React from 'react';
import { ProjectCardProps } from './types';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import Link from 'next/link';

const ProjectCard: React.FC<ProjectCardProps> = ({ project, locale }) => {
  const isRtl = locale === 'fa';
  
  return (
    <Link 
      href={`/${locale}/projects/${project.slug}`}
      className={twMerge(
        "group block overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950",
        isRtl ? "text-right" : "text-left"
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {project.image ? (
          <Image 
            src={project.image} 
            alt={isRtl ? project.titleFa : project.titleEn}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-400">
            {isRtl ? 'پیش‌نمایش یوتیوب' : 'YouTube Preview'}
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {isRtl ? project.titleFa : project.titleEn}
        </h3>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400 line-clamp-2">
          {isRtl ? project.descFa : project.descEn}
        </p>
      </div>
    </Link>
  );
};

export default ProjectCard;
