'use client';

import React, { useState, useEffect } from 'react';
import ImageUpload from './ImageUpload';
import { createProject, updateProject } from '@/actions/project';
import { useRouter } from 'next/navigation';
import { Loader2, X } from 'lucide-react';

interface ProjectFormProps {
  locale: string;
  initialData?: any;
  onClose?: () => void;
}

export default function ProjectForm({ locale, initialData, onClose }: ProjectFormProps) {
  const isRtl = locale === 'fa';
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.append('imageUrl', imageUrl); 
    
    if (initialData) {
      formData.append('currentImageUrl', initialData.imageUrl || '');
      const result = await updateProject(initialData.id, formData);
      if (result.success) {
        router.refresh();
        if (onClose) onClose();
      } else {
        alert(result.error);
      }
    } else {
      const data = {
        titleEn: formData.get('titleEn') as string,
        titleFa: formData.get('titleFa') as string,
        descriptionEn: formData.get('descriptionEn') as string,
        descriptionFa: formData.get('descriptionFa') as string,
        youtubeUrl: formData.get('youtubeUrl') as string,
        imageUrl: imageUrl,
        published: formData.get('published') === 'true',
      };
      const result = await createProject(data);
      if (result.success) {
        router.refresh();
        (e.target as HTMLFormElement).reset();
        setImageUrl('');
        if (onClose) onClose();
      } else {
        alert(result.error);
      }
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-6 rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold">
          {initialData 
            ? (isRtl ? 'ویرایش پروژه' : 'Edit Project') 
            : (isRtl ? 'افزودن پروژه جدید' : 'Add New Project')}
        </h2>
        {onClose && (
          <button type="button" onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={24} />
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <ImageUpload onUploadComplete={setImageUrl} defaultValue={initialData?.imageUrl} />
            <p className="mt-1 text-xs text-zinc-500">
              {isRtl 
                ? '(اختیاری. در صورت خالی بودن از تامنیل یوتیوب استفاده می‌شود)' 
                : '(Optional. Will use YouTube thumbnail if left blank)'}
            </p>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1 ml-1">{isRtl ? 'لینک یوتیوب' : 'YouTube URL'}</label>
            <input
              name="youtubeUrl"
              defaultValue={initialData?.youtubeUrl}
              placeholder="https://youtube.com/..."
              className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <input
            name="titleEn"
            defaultValue={initialData?.titleEn}
            placeholder="Title (English)"
            required
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            name="titleFa"
            defaultValue={initialData?.titleFa}
            placeholder="عنوان (فارسی)"
            dir="rtl"
            required
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="descriptionEn"
            defaultValue={initialData?.descriptionEn}
            placeholder="Description (English)"
            rows={3}
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            name="descriptionFa"
            defaultValue={initialData?.descriptionFa}
            placeholder="توضیحات (فارسی)"
            dir="rtl"
            rows={3}
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex items-center gap-4">
            {!initialData && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="published" value="true" className="h-4 w-4 rounded border-zinc-800 bg-zinc-900" />
                <span className="text-sm">{isRtl ? 'انتشار فوری' : 'Publish Immediately'}</span>
              </label>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-600 p-3 font-bold text-white transition-colors hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? <Loader2 className="mx-auto animate-spin" /> : (initialData ? (isRtl ? 'بروزرسانی' : 'Update') : (isRtl ? 'ایجاد پروژه' : 'Create Project'))}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
