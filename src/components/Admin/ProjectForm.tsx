'use client';

import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import { createProject } from '@/actions/admin';
import { useRouter } from 'next/navigation';

export default function ProjectForm({ locale }: { locale: string }) {
  const isRtl = locale === 'fa';
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      slug: formData.get('slug') as string,
      titleEn: formData.get('titleEn') as string,
      titleFa: formData.get('titleFa') as string,
      descEn: formData.get('descEn') as string,
      descFa: formData.get('descFa') as string,
      youtubeUrl: formData.get('youtubeUrl') as string,
      image: imageUrl,
      published: formData.get('published') === 'true',
    };

    const result = await createProject(data);
    if (result.success) {
      router.refresh();
      (e.target as HTMLFormElement).reset();
      setImageUrl('');
    } else {
      alert('Error creating project');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-12 space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-xl font-bold">{isRtl ? 'افزودن پروژه جدید' : 'Add New Project'}</h2>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <ImageUpload onUploadComplete={setImageUrl} />
          
          <input
            name="slug"
            placeholder={isRtl ? 'نامک (Slug)' : 'Slug'}
            required
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <input
            name="youtubeUrl"
            placeholder={isRtl ? 'لینک یوتیوب' : 'YouTube URL'}
            required
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          <input
            name="titleEn"
            placeholder="Title (English)"
            required
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="titleFa"
            placeholder="عنوان (فارسی)"
            dir="rtl"
            required
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="descEn"
            placeholder="Description (English)"
            rows={3}
            required
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="descFa"
            placeholder="توضیحات (فارسی)"
            dir="rtl"
            rows={3}
            required
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="published" value="true" className="h-4 w-4 rounded border-zinc-800 bg-zinc-900" />
              <span className="text-sm">{isRtl ? 'انتشار فوری' : 'Publish Immediately'}</span>
            </label>
            
            <button
              type="submit"
              disabled={loading || !imageUrl}
              className="flex-1 rounded-lg bg-blue-600 p-3 font-bold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? (isRtl ? 'در حال ارسال...' : 'Creating...') : (isRtl ? 'ایجاد پروژه' : 'Create Project')}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
