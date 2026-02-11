import React from 'react';
import { ProjectGridProps } from './types';
import ProjectCard from './ProjectCard';

const ProjectGrid: React.FC<ProjectGridProps> = ({ projects, locale }) => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} locale={locale} />
      ))}
    </div>
  );
};

export default ProjectGrid;
