'use client';

import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import { createHeroSlide, updateHeroSlide } from '@/actions/hero';
import { useRouter } from 'next/navigation';
import { Loader2, X } from 'lucide-react';

interface HeroFormProps {
  locale: string;
  initialData?: any;
  onClose?: () => void;
}

export default function HeroForm({ locale, initialData, onClose }: HeroFormProps) {
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
      const result = await updateHeroSlide(initialData.id, formData);
      if (result.success) {
        router.refresh();
        if (onClose) onClose();
      } else {
        alert(result.error);
      }
    } else {
      const result = await createHeroSlide(formData);
      if (result.success) {
        router.refresh();
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
            ? (isRtl ? 'ویرایش اسلاید' : 'Edit Hero Slide') 
            : (isRtl ? 'افزودن اسلاید هیرو' : 'Add Hero Slide')}
        </h2>
        {onClose && (
          <button type="button" onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={24} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <ImageUpload onUploadComplete={setImageUrl} defaultValue={initialData?.imageUrl} />
          <input 
            name="order" 
            type="number" 
            defaultValue={initialData?.order || 0}
            placeholder="Order (0, 1, 2...)" 
            className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-white" 
          />
        </div>
        <div className="space-y-4">
          <input name="titleEn" defaultValue={initialData?.titleEn} placeholder="Title (EN)" required className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-white" />
          <input name="titleFa" defaultValue={initialData?.titleFa} placeholder="عنوان (FA)" dir="rtl" required className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-white" />
          <input name="subtitleEn" defaultValue={initialData?.subtitleEn} placeholder="Subtitle (EN)" required className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-white" />
          <input name="subtitleFa" defaultValue={initialData?.subtitleFa} placeholder="زیرنویس (FA)" dir="rtl" required className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3 text-white" />
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white disabled:opacity-50 transition-colors hover:bg-blue-500"
          >
            {loading ? <Loader2 className="mx-auto animate-spin" /> : (initialData ? (isRtl ? 'بروزرسانی' : 'Update') : (isRtl ? 'ذخیره اسلاید' : 'Save Slide'))}
          </button>
        </div>
      </div>
    </form>
  );
}
