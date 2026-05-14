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
import { setSubmissionRead, deleteSubmission } from '@/actions/contactSubmissions';
import { signOut } from '@/actions/auth';
import {
  Plus,
  LayoutGrid,
  Image as ImageIcon,
  LogOut,
  Tags,
  Inbox,
  Mail,
  MailOpen,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import type {
  SerializedProject,
  SerializedHeroSlide,
  SerializedCategory,
  SerializedContactSubmission,
} from '@/lib/types';

type TabKey = 'projects' | 'hero' | 'categories' | 'submissions';

interface AdminDashboardProps {
  initialProjects: SerializedProject[];
  initialHeroSlides: SerializedHeroSlide[];
  initialCategories: SerializedCategory[];
  initialSubmissions: SerializedContactSubmission[];
  locale: string;
}

export default function AdminDashboard({
  initialProjects,
  initialHeroSlides,
  initialCategories,
  initialSubmissions,
  locale,
}: AdminDashboardProps) {
  const isRtl = locale === 'fa';
  const [activeTab, setActiveTab] = useState<TabKey>('projects');
  const [editingItem, setEditingItem] = useState<
    SerializedProject | SerializedHeroSlide | SerializedCategory | null
  >(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [projects, setProjects] = useState(initialProjects);
  const [heroSlides, setHeroSlides] = useState(initialHeroSlides);
  const [categories, setCategories] = useState(initialCategories);

  // Keep local state in sync when the server pushes fresh props (after revalidate).
  React.useEffect(() => setProjects(initialProjects), [initialProjects]);
  React.useEffect(() => setHeroSlides(initialHeroSlides), [initialHeroSlides]);
  React.useEffect(() => setCategories(initialCategories), [initialCategories]);
  React.useEffect(() => setSubmissions(initialSubmissions), [initialSubmissions]);

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

  const handleDeleteProject = (item: SortableItem) => {
    if (
      !confirm(
        isRtl
          ? 'آیا از حذف این پروژه مطمئن هستید؟'
          : 'Are you sure you want to delete this project?',
      )
    ) {
      return;
    }
    const previous = projects;
    setProjects((prev) => prev.filter((p) => p.id !== item.id));
    void deleteProject(item.id).then((result) => {
      if (!result.success) {
        setProjects(previous);
        alert(isRtl ? 'خطا در حذف پروژه' : 'Failed to delete project');
      }
    });
  };

  const handleDeleteHero = (item: SortableItem) => {
    if (!confirm(isRtl ? 'حذف اسلاید؟' : 'Delete slide?')) return;
    const previous = heroSlides;
    setHeroSlides((prev) => prev.filter((s) => s.id !== item.id));
    void deleteHeroSlide(item.id, item.image ?? '').then((result) => {
      if (result && !result.success) setHeroSlides(previous);
    });
  };

  const handleToggleProject = (id: string, currentStatus: boolean) => {
    const next = !currentStatus;
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, published: next } : p)));
    void toggleProjectStatus(id, currentStatus).then((result) => {
      if (!result?.success) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, published: currentStatus } : p)),
        );
      }
    });
  };

  const handleToggleHero = (id: string, currentStatus: boolean) => {
    const next = !currentStatus;
    setHeroSlides((prev) => prev.map((s) => (s.id === id ? { ...s, active: next } : s)));
    void toggleHeroStatus(id, currentStatus).then((result) => {
      if (result && !result.success) {
        setHeroSlides((prev) =>
          prev.map((s) => (s.id === id ? { ...s, active: currentStatus } : s)),
        );
      }
    });
  };

  const handleToggleCategory = (id: string, currentVisible: boolean) => {
    const next = !currentVisible;
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, visible: next } : c)));
    void toggleCategoryVisibility(id, currentVisible).then((result) => {
      if (result && !result.success) {
        setCategories((prev) =>
          prev.map((c) => (c.id === id ? { ...c, visible: currentVisible } : c)),
        );
      }
    });
  };

  const handleDeleteCategory = (item: SortableItem) => {
    if (
      !confirm(
        isRtl
          ? 'حذف دسته‌بندی؟ پروژه‌های آن بدون دسته‌بندی خواهند شد.'
          : 'Delete category? Projects in it will become uncategorized.',
      )
    ) {
      return;
    }
    const previous = categories;
    setCategories((prev) => prev.filter((c) => c.id !== item.id));
    void deleteCategory(item.id).then((result) => {
      if (result && !result.success) setCategories(previous);
    });
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

  const unreadCount = submissions.filter((s) => !s.read).length;

  const tabs: { key: TabKey; label: string; icon: React.ReactNode; badge?: number }[] = [
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
    {
      key: 'submissions',
      label: isRtl ? 'پیام‌ها' : 'Submissions',
      icon: <Inbox size={16} />,
      badge: unreadCount,
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
      submissions: { en: 'No submissions yet', fa: 'هنوز پیامی دریافت نشده' },
    };
    const icon =
      activeTab === 'projects' ? (
        <LayoutGrid size={64} />
      ) : activeTab === 'hero' ? (
        <ImageIcon size={64} />
      ) : activeTab === 'categories' ? (
        <Tags size={64} />
      ) : (
        <Inbox size={64} />
      );

    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 py-20 text-center">
        <div className="mb-4 text-zinc-700">{icon}</div>
        <p className="mb-6 text-zinc-500">
          {isRtl ? labels[activeTab].fa : labels[activeTab].en}
        </p>
        {activeTab !== 'submissions' && (
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
        )}
      </div>
    );
  };

  const handleToggleSubmissionRead = (id: string, currentRead: boolean) => {
    const next = !currentRead;
    // Optimistic: flip locally first; the action runs in the background.
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, read: next } : s)),
    );
    void setSubmissionRead(id, next).then((result) => {
      if (!result.success) {
        // Roll back on failure.
        setSubmissions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, read: currentRead } : s)),
        );
      }
    });
  };

  const handleDeleteSubmission = (id: string) => {
    if (!confirm(isRtl ? 'این پیام حذف شود؟' : 'Delete this submission?')) {
      return;
    }
    const previous = submissions;
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
    void deleteSubmission(id).then((result) => {
      if (!result.success) {
        setSubmissions(previous);
      }
    });
  };

  const renderSubmissions = () => (
    <div className="space-y-3">
      {submissions.map((s) => {
        const formattedDate = s.createdAt.toLocaleString(isRtl ? 'fa-IR' : 'en-US', {
          dateStyle: 'medium',
          timeStyle: 'short',
        });
        return (
          <div
            key={s.id}
            className={`rounded-xl border p-5 transition-colors ${
              s.read
                ? 'border-zinc-900 bg-zinc-950/40'
                : 'border-blue-600/40 bg-blue-600/5'
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  {!s.read && (
                    <span
                      aria-hidden
                      className="inline-block size-2 rounded-full bg-blue-500"
                    />
                  )}
                  <p className="truncate text-lg font-bold text-white">{s.name}</p>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400">
                  <a
                    href={`mailto:${encodeURIComponent(s.email)}?subject=${encodeURIComponent(
                      `Re: Your project inquiry`,
                    )}&body=${encodeURIComponent(
                      `Hi ${s.name},\n\nThanks for reaching out — \n\n---\nYour message:\n${s.message}`,
                    )}`}
                    className="underline-offset-2 hover:text-white hover:underline"
                    dir="ltr"
                  >
                    {s.email}
                  </a>
                  <a
                    href={`tel:${s.phone.replace(/[^\d+]/g, '')}`}
                    className="underline-offset-2 hover:text-white hover:underline"
                    dir="ltr"
                  >
                    {s.phone}
                  </a>
                  <span className="text-zinc-600">{formattedDate}</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  onClick={() => handleToggleSubmissionRead(s.id, s.read)}
                  title={
                    s.read
                      ? isRtl
                        ? 'علامت‌گذاری به عنوان نخوانده'
                        : 'Mark unread'
                      : isRtl
                        ? 'علامت‌گذاری به عنوان خوانده‌شده'
                        : 'Mark read'
                  }
                  className="rounded-full border border-zinc-800 p-2 text-zinc-400 transition-colors hover:border-zinc-600 hover:text-white"
                >
                  {s.read ? <Mail size={14} /> : <MailOpen size={14} />}
                </button>
                <button
                  onClick={() => handleDeleteSubmission(s.id)}
                  title={isRtl ? 'حذف' : 'Delete'}
                  className="rounded-full border border-zinc-800 p-2 text-zinc-400 transition-colors hover:border-red-500/60 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p
              className="mt-4 whitespace-pre-wrap text-sm text-zinc-300"
              dir={isRtl ? 'rtl' : 'ltr'}
            >
              {s.message}
            </p>
            {!s.emailSent && (
              <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-400">
                <AlertTriangle size={14} />
                <span>
                  {isRtl ? 'ایمیل ارسال نشد' : 'Email delivery failed'}
                  {s.emailError ? ` — ${s.emailError}` : ''}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:gap-10">
      {/* Sidebar */}
      <aside className="md:sticky md:top-6 md:h-[calc(100vh-3rem)] md:w-64 md:shrink-0 md:self-start">
        <div className="flex h-full flex-col gap-6 rounded-2xl border border-zinc-900 bg-zinc-950/60 p-5 backdrop-blur">
          <div>
            <h1 className="text-2xl font-black tracking-tight">
              {isRtl ? 'مدیریت استودیو' : 'STUDIO CMS'}
            </h1>
            <p className="mt-1 text-xs text-zinc-500">
              {isRtl ? 'مدیریت محتوا' : 'Content management'}
            </p>
          </div>

          <nav className="flex flex-row gap-2 overflow-x-auto md:flex-col md:gap-1 md:overflow-visible">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all md:w-full ${
                    isRtl ? 'flex-row-reverse text-right' : 'text-left'
                  } ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <span className="shrink-0">{tab.icon}</span>
                  <span className="flex-1 uppercase tracking-wider">{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-black ${
                        isActive ? 'bg-white text-blue-600' : 'bg-red-500 text-white'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <form action={signOut.bind(null, locale)} className="mt-auto hidden md:block">
            <button
              type="submit"
              className={`flex w-full items-center gap-3 rounded-xl border border-zinc-800 px-4 py-2.5 text-sm font-bold text-zinc-400 transition-all hover:border-zinc-600 hover:text-white ${
                isRtl ? 'flex-row-reverse text-right' : 'text-left'
              }`}
            >
              <LogOut size={14} />
              <span className="flex-1">{isRtl ? 'خروج' : 'Sign Out'}</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main column */}
      <div className="min-w-0 flex-1">
        {/* Action bar */}
        <div className="mb-6 flex items-center justify-between gap-3">
          {activeTab !== 'submissions' ? (
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
          ) : (
            <div />
          )}
          <form action={signOut.bind(null, locale)} className="md:hidden">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-full border border-zinc-800 px-4 py-2.5 text-sm font-bold text-zinc-400 transition-all hover:border-zinc-600 hover:text-white"
            >
              <LogOut size={14} />
              {isRtl ? 'خروج' : 'Sign Out'}
            </button>
          </form>
        </div>


      {/* Main Content Area */}
      <div className="min-h-100">
        {activeTab === 'projects' &&
          (projects.length === 0 ? (
            renderEmptyState()
          ) : (
            <SortableList
              items={projects.map((p) => ({
                id: p.id,
                title: isRtl ? p.titleFa : p.titleEn,
                image: p.imageUrl,
                youtubeUrl: p.youtubeUrl,
                active: p.published,
              }))}
              onReorder={(items) => handleReorder(items, 'project')}
              isRtl={isRtl}
              onEdit={(item) => {
                const fullData = projects.find((p) => p.id === item.id) ?? null;
                setEditingItem(fullData);
                setShowAddForm(true);
              }}
              onDelete={handleDeleteProject}
              onToggle={handleToggleProject}
            />
          ))}

        {activeTab === 'hero' &&
          (heroSlides.length === 0 ? (
            renderEmptyState()
          ) : (
            <SortableList
              items={heroSlides.map((s) => ({
                id: s.id,
                title: isRtl ? s.titleFa ?? '' : s.titleEn ?? '',
                image: s.imageUrl,
                youtubeUrl: s.youtubeUrl,
                active: s.active,
              }))}
              onReorder={(items) => handleReorder(items, 'hero')}
              isRtl={isRtl}
              onEdit={(item) => {
                const fullData = heroSlides.find((s) => s.id === item.id) ?? null;
                setEditingItem(fullData);
                setShowAddForm(true);
              }}
              onDelete={handleDeleteHero}
              onToggle={handleToggleHero}
            />
          ))}

        {activeTab === 'categories' &&
          (categories.length === 0 ? (
            renderEmptyState()
          ) : (
            <SortableList
              items={categories.map((c) => ({
                id: c.id,
                title: isRtl ? c.nameFa : c.nameEn,
                image: null,
                youtubeUrl: null,
                active: c.visible,
              }))}
              onReorder={(items) => handleReorder(items, 'category')}
              isRtl={isRtl}
              onEdit={(item) => {
                const fullData = categories.find((c) => c.id === item.id) ?? null;
                setEditingItem(fullData);
                setShowAddForm(true);
              }}
              onDelete={handleDeleteCategory}
              onToggle={handleToggleCategory}
            />
          ))}

        {activeTab === 'submissions' &&
          (submissions.length === 0 ? renderEmptyState() : renderSubmissions())}
        </div>
      </div>

      {/* Overlay Form Modal */}
      <AnimatePresence>
        {activeTab !== 'submissions' && (showAddForm || editingItem) && (
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
                  categories={categories}
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
