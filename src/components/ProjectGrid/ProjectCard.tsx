import React from 'react';
import { ProjectCardProps } from './types';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { getYouTubeMaxResThumbnail } from '@/lib/youtube';

const ProjectCard: React.FC<ProjectCardProps> = ({ project, locale }) => {
  const isRtl = locale === 'fa';
  const youtubeThumbnailUrl = getYouTubeMaxResThumbnail(project.youtubeUrl);
  const displayImageUrl = youtubeThumbnailUrl || project.imageUrl;

  return (
    <Link
      href={`/${locale}/projects/${project.slug}`}
      className={twMerge(
        "group block overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-950 transition-all duration-300 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1",
        isRtl ? "text-right" : "text-left"
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
        {displayImageUrl ? (
          <Image
            src={displayImageUrl}
            alt={isRtl ? project.titleFa : project.titleEn}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-600">
            {isRtl ? 'پیش‌نمایش' : 'No preview'}
          </div>
        )}
        {/* Arrow overlay on hover */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/30">
          <div className="flex size-12 items-center justify-center rounded-full bg-white/0 text-white/0 shadow-lg transition-all duration-300 group-hover:bg-white/10 group-hover:text-white/80 group-hover:scale-100 scale-75">
            <ArrowUpRight size={22} />
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className={`text-xl font-bold text-zinc-50 transition-colors group-hover:text-blue-400 ${isRtl ? '' : 'relative w-fit'}`}>
          {isRtl ? project.titleFa : project.titleEn}
          {!isRtl && (
            <span className="absolute -bottom-px left-0 h-px w-0 bg-blue-500 transition-all duration-300 group-hover:w-full" />
          )}
        </h3>
        <p className="mt-2 text-sm text-zinc-500 line-clamp-2">
          {isRtl ? project.descriptionFa : project.descriptionEn}
        </p>
      </div>
    </Link>
  );
};

export default ProjectCard;
