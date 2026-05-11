'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import type { SortableItem } from './SortableList';

const SortableList = dynamic(() => import('./SortableList'), {
  ssr: false,
  loading: () => (
    <div className="animate-pulse space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-16 rounded-xl bg-zinc-800/50" />
      ))}
    </div>
  ),
});
import ProjectForm from './ProjectForm';
import HeroForm from './HeroForm';
import CategoryForm from './CategoryForm';
import { updateOrder } from '@/actions/reorder';
import { deleteHeroSlide, toggleHeroStatus } from '@/actions/hero';
import { deleteProject } from '@/actions/project';
import { toggleProjectStatus } from '@/actions/admin';
import { deleteCategory, toggleCategoryVisibility } from '@/actions/category';
import { signOut } from '@/actions/auth';
import {
  Plus,
  LayoutGrid,
  Image as ImageIcon,
  LogOut,
  Tags,
} from 'lucide-react';
import type {
  SerializedProject,
  SerializedHeroSlide,
  SerializedCategory,
} from '@/lib/types';

type TabKey = 'projects' | 'hero' | 'categories';

interface AdminDashboardProps {
  initialProjects: SerializedProject[];
  initialHeroSlides: SerializedHeroSlide[];
  initialCategories: SerializedCategory[];
  locale: string;
}

export default function AdminDashboard({
  initialProjects,
  initialHeroSlides,
  initialCategories,
  locale,
}: AdminDashboardProps) {
  const isRtl = locale === 'fa';
  const [activeTab, setActiveTab] = useState<TabKey>('projects');
  const [editingItem, setEditingItem] = useState<
    SerializedProject | SerializedHeroSlide | SerializedCategory | null
  >(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleReorder = async (
    newItems: SortableItem[],
    type: 'project' | 'hero' | 'category',
  ) => {
    const itemsWithOrder = newItems.map((item, index) => ({
      id: item.id,
      order: index,
    }));
    return await updateOrder(itemsWithOrder, type);
  };

  const handleDeleteProject = async (item: SortableItem) => {
    if (
      confirm(
        isRtl
          ? 'آیا از حذف این پروژه مطمئن هستید؟'
          : 'Are you sure you want to delete this project?',
      )
    ) {
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

  const handleDeleteCategory = async (item: SortableItem) => {
    if (
      confirm(
        isRtl
          ? 'حذف دسته‌بندی؟ پروژه‌های آن بدون دسته‌بندی خواهند شد.'
          : 'Delete category? Projects in it will become uncategorized.',
      )
    ) {
      await deleteCategory(item.id);
    }
  };

  const addLabel = isRtl
    ? activeTab === 'categories'
      ? 'افزودن دسته‌بندی'
      : activeTab === 'hero'
        ? 'افزودن اسلاید'
        : 'افزودن پروژه'
    : activeTab === 'categories'
      ? 'Add Category'
      : activeTab === 'hero'
        ? 'Add Slide'
        : 'Add Project';

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    {
      key: 'projects',
      label: isRtl ? 'پروژه‌ها' : 'Projects',
      icon: <LayoutGrid size={16} />,
    },
    {
      key: 'hero',
      label: isRtl ? 'هیرو' : 'Hero',
      icon: <ImageIcon size={16} />,
    },
    {
      key: 'categories',
      label: isRtl ? 'دسته‌بندی‌ها' : 'Categories',
      icon: <Tags size={16} />,
    },
  ];

  const closeModal = () => {
    setShowAddForm(false);
    setEditingItem(null);
  };

  const renderEmptyState = () => {
    const labels: Record<TabKey, { en: string; fa: string }> = {
      projects: { en: 'No projects yet', fa: 'هنوز پروژه‌ای وجود ندارد' },
      hero: { en: 'No hero slides yet', fa: 'هنوز اسلایدی وجود ندارد' },
      categories: { en: 'No categories yet', fa: 'هنوز دسته‌بندی‌ای وجود ندارد' },
    };
    const icon =
      activeTab === 'projects' ? (
        <LayoutGrid size={64} />
      ) : activeTab === 'hero' ? (
        <ImageIcon size={64} />
      ) : (
        <Tags size={64} />
      );

    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 py-20 text-center">
        <div className="mb-4 text-zinc-700">{icon}</div>
        <p className="mb-6 text-zinc-500">
          {isRtl ? labels[activeTab].fa : labels[activeTab].en}
        </p>
        <button
          onClick={() => {
            setEditingItem(null);
            setShowAddForm(true);
          }}
          className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold transition-all hover:bg-blue-500 hover:scale-105"
        >
          <Plus size={16} />
          {addLabel}
        </button>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-5xl">
      {/* Sticky header */}
      <header className="sticky top-0 z-30 -mx-4 mb-8 flex flex-col gap-6 border-b border-zinc-900 bg-black/80 px-4 py-4 backdrop-blur md:-mx-10 md:flex-row md:items-center md:justify-between md:px-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            {isRtl ? 'مدیریت استودیو' : 'STUDIO CMS'}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {isRtl
              ? 'مدیریت محتوا و چیدمان استودیو'
              : 'Manage your studio content and layout'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setEditingItem(null);
              setShowAddForm(true);
            }}
            className="flex items-center justify-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold transition-all hover:bg-blue-500 hover:scale-105 hover:shadow-lg hover:shadow-blue-600/20"
          >
            <Plus size={18} />
            {addLabel}
          </button>
          <form action={signOut.bind(null, locale)}>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-2.5 text-sm font-bold text-zinc-400 transition-all hover:border-zinc-600 hover:text-white"
            >
              <LogOut size={14} />
              {isRtl ? 'خروج' : 'Sign Out'}
            </button>
          </form>
        </div>
      </header>

      {/* Pill tabs */}
      <div className="mb-8 inline-flex rounded-full border border-zinc-800 bg-zinc-950/60 p-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-zinc-500 hover:text-zinc-200'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="min-h-100">
        {activeTab === 'projects' &&
          (initialProjects.length === 0 ? (
            renderEmptyState()
          ) : (
            <SortableList
              items={initialProjects.map((p) => ({
                id: p.id,
                title: isRtl ? p.titleFa : p.titleEn,
                image: p.imageUrl,
                youtubeUrl: p.youtubeUrl,
                active: p.published,
              }))}
              onReorder={(items) => handleReorder(items, 'project')}
              isRtl={isRtl}
              onEdit={(item) => {
                const fullData =
                  initialProjects.find((p) => p.id === item.id) ?? null;
                setEditingItem(fullData);
                setShowAddForm(true);
              }}
              onDelete={handleDeleteProject}
              onToggle={(id, status) => {
                toggleProjectStatus(id, status);
              }}
            />
          ))}

        {activeTab === 'hero' &&
          (initialHeroSlides.length === 0 ? (
            renderEmptyState()
          ) : (
            <SortableList
              items={initialHeroSlides.map((s) => ({
                id: s.id,
                title: isRtl ? s.titleFa ?? '' : s.titleEn ?? '',
                image: s.imageUrl,
                youtubeUrl: s.youtubeUrl,
                active: s.active,
              }))}
              onReorder={(items) => handleReorder(items, 'hero')}
              isRtl={isRtl}
              onEdit={(item) => {
                const fullData =
                  initialHeroSlides.find((s) => s.id === item.id) ?? null;
                setEditingItem(fullData);
                setShowAddForm(true);
              }}
              onDelete={handleDeleteHero}
              onToggle={(id, status) => {
                toggleHeroStatus(id, status);
              }}
            />
          ))}

        {activeTab === 'categories' &&
          (initialCategories.length === 0 ? (
            renderEmptyState()
          ) : (
            <SortableList
              items={initialCategories.map((c) => ({
                id: c.id,
                title: isRtl ? c.nameFa : c.nameEn,
                image: null,
                youtubeUrl: null,
                active: c.visible,
              }))}
              onReorder={(items) => handleReorder(items, 'category')}
              isRtl={isRtl}
              onEdit={(item) => {
                const fullData =
                  initialCategories.find((c) => c.id === item.id) ?? null;
                setEditingItem(fullData);
                setShowAddForm(true);
              }}
              onDelete={handleDeleteCategory}
              onToggle={(id, status) => {
                toggleCategoryVisibility(id, status);
              }}
            />
          ))}
      </div>

      {/* Overlay Form Modal */}
      <AnimatePresence>
        {(showAddForm || editingItem) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {activeTab === 'projects' ? (
                <ProjectForm
                  locale={locale}
                  initialData={editingItem as SerializedProject | undefined}
                  categories={initialCategories}
                  onClose={closeModal}
                />
              ) : activeTab === 'hero' ? (
                <HeroForm
                  locale={locale}
                  initialData={editingItem as SerializedHeroSlide | undefined}
                  onClose={closeModal}
                />
              ) : (
                <CategoryForm
                  locale={locale}
                  initialData={editingItem as SerializedCategory | undefined}
                  onClose={closeModal}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
