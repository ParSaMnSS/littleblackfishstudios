'use client';

import React, { useState } from 'react';
import SortableList, { type SortableItem } from './SortableList';
import ProjectForm from './ProjectForm';
import HeroForm from './HeroForm';
import { updateOrder } from '@/actions/reorder';
import { deleteHeroSlide, toggleHeroStatus } from '@/actions/hero';
import { deleteProject } from '@/actions/project';
import { toggleProjectStatus } from '@/actions/admin';
import { signOut } from '@/actions/auth';
import { Plus, LayoutGrid, Image as ImageIcon, LogOut } from 'lucide-react';
import type { SerializedProject, SerializedHeroSlide } from '@/lib/types';

interface AdminDashboardProps {
  initialProjects: SerializedProject[];
  initialHeroSlides: SerializedHeroSlide[];
  locale: string;
}

export default function AdminDashboard({ initialProjects, initialHeroSlides, locale }: AdminDashboardProps) {
  const isRtl = locale === 'fa';
  const [activeTab, setActiveTab] = useState<'projects' | 'hero'>('projects');
  const [editingItem, setEditingItem] = useState<SerializedProject | SerializedHeroSlide | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleReorder = async (newItems: SortableItem[], type: 'project' | 'hero') => {
    const itemsWithOrder = newItems.map((item, index) => ({
      id: item.id,
      order: index,
    }));
    return await updateOrder(itemsWithOrder, type);
  };

  const handleDeleteProject = async (item: SortableItem) => {
    if (confirm(isRtl ? 'آیا از حذف این پروژه مطمئن هستید؟' : 'Are you sure you want to delete this project?')) {
      const result = await deleteProject(item.id);
      if (!result.success) {
        alert(isRtl ? 'خطا در حذف پروژه' : 'Failed to delete project');
      }
    }
  };

  const handleDeleteHero = async (item: SortableItem) => {
    if (confirm(isRtl ? 'حذف اسلاید؟' : 'Delete slide?')) {
      await deleteHeroSlide(item.id, item.image ?? '');
    }
  };

  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight">{isRtl ? 'مدیریت استودیو' : 'STUDIO CMS'}</h1>
          <p className="mt-2 text-zinc-500">{isRtl ? 'مدیریت محتوا و چیدمان استودیو' : 'Manage your studio content and layout'}</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingItem(null);
              setShowAddForm(true);
            }}
            className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-3 font-bold transition-all hover:bg-blue-500 hover:scale-105"
          >
            <Plus size={20} />
            {isRtl ? 'افزودن محتوا' : 'Add Content'}
          </button>
          <form action={signOut.bind(null, locale)}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full border border-zinc-700 px-4 py-3 text-sm font-bold text-zinc-400 transition-all hover:border-zinc-500 hover:text-white"
            >
              <LogOut size={16} />
              {isRtl ? 'خروج' : 'Sign Out'}
            </button>
          </form>
        </div>
      </header>

      {/* Tabs */}
      <div className="mb-8 flex border-b border-zinc-800">
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all ${
            activeTab === 'projects' ? 'border-b-2 border-blue-500 text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <LayoutGrid size={18} />
          {isRtl ? 'پروژه‌ها' : 'Projects'}
        </button>
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-bold uppercase tracking-widest transition-all ${
            activeTab === 'hero' ? 'border-b-2 border-blue-500 text-white' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <ImageIcon size={18} />
          {isRtl ? 'هیرو' : 'Hero'}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="min-h-100">
        {activeTab === 'projects' ? (
          <SortableList
            items={initialProjects.map(p => ({
              id: p.id,
              title: isRtl ? p.titleFa : p.titleEn,
              image: p.imageUrl,
              youtubeUrl: p.youtubeUrl,
              active: p.published
            }))}
            onReorder={(items) => handleReorder(items, 'project')}
            isRtl={isRtl}
            onEdit={(item) => {
              const fullData = initialProjects.find(p => p.id === item.id) ?? null;
              setEditingItem(fullData);
              setShowAddForm(true);
            }}
            onDelete={handleDeleteProject}
            onToggle={(id, status) => { toggleProjectStatus(id, status); }}
          />
        ) : (
          <SortableList
            items={initialHeroSlides.map(s => ({
              id: s.id,
              title: isRtl ? (s.titleFa ?? '') : (s.titleEn ?? ''),
              image: s.imageUrl,
              youtubeUrl: s.youtubeUrl,
              active: s.active
            }))}
            onReorder={(items) => handleReorder(items, 'hero')}
            isRtl={isRtl}
            onEdit={(item) => {
              const fullData = initialHeroSlides.find(s => s.id === item.id) ?? null;
              setEditingItem(fullData);
              setShowAddForm(true);
            }}
            onDelete={handleDeleteHero}
            onToggle={(id, status) => { toggleHeroStatus(id, status); }}
          />
        )}
      </div>

      {/* Overlay Form Modal */}
      {(showAddForm || editingItem) && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            {activeTab === 'projects' ? (
              <ProjectForm
                locale={locale}
                initialData={editingItem as SerializedProject | undefined}
                onClose={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                }}
              />
            ) : (
              <HeroForm
                locale={locale}
                initialData={editingItem as SerializedHeroSlide | undefined}
                onClose={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
