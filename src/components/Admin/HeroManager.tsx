'use client';

import React, { useState } from 'react';
import { createHeroSlide, deleteHeroSlide, toggleHeroStatus } from '@/actions/hero';
import ImageUpload from './ImageUpload';
import Image from 'next/image';
import { Trash2, Eye, EyeOff, Plus, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HeroSlide {
  id: string;
  titleEn: string;
  titleFa: string;
  imageUrl: string;
  active: boolean;
  order: number;
}

export default function HeroManager({ initialSlides, locale }: { initialSlides: HeroSlide[], locale: string }) {
  const isRtl = locale === 'fa';
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showForm, setShowForm] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    // The ImageUpload component handles the actual blob upload, 
    // but here we just need to ensure the URL is passed or we use the file directly.
    // To match the action logic, we'll append the file.
    const fileInput = (e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement);
    if (fileInput.files?.[0]) {
      formData.append('file', fileInput.files[0]);
    }

    const result = await createHeroSlide(formData);
    if (result.success) {
      router.refresh();
      setShowForm(false);
      setImageUrl('');
    } else {
      alert('Error creating slide');
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{isRtl ? 'مدیریت هیرو' : 'Hero Manager'}</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500"
        >
          {showForm ? (isRtl ? 'بستن' : 'Close') : (isRtl ? 'افزودن اسلاید' : 'Add Slide')}
          {!showForm && <Plus size={18} />}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <ImageUpload onUploadComplete={setImageUrl} />
              <input type="hidden" name="imageUrl" value={imageUrl} />
            </div>
            <div className="space-y-4">
              <input name="titleEn" placeholder="Title (EN)" required className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3" />
              <input name="titleFa" placeholder="عنوان (FA)" dir="rtl" required className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3" />
              <input name="subtitleEn" placeholder="Subtitle (EN)" required className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3" />
              <input name="subtitleFa" placeholder="زیرنویس (FA)" dir="rtl" required className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3" />
              <input name="order" type="number" placeholder="Order" className="w-full rounded-lg bg-zinc-900 border border-zinc-800 p-3" />
              
              <button 
                type="submit" 
                disabled={loading}
                className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white disabled:opacity-50"
              >
                {loading ? <Loader2 className="mx-auto animate-spin" /> : (isRtl ? 'ذخیره اسلاید' : 'Save Slide')}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialSlides.map((slide) => (
          <div key={slide.id} className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
            <div className="relative aspect-video w-full">
              {slide.imageUrl.match(/\.(mp4|webm|ogg)$/) ? (
                <video 
                  src={slide.imageUrl} 
                  className={`h-full w-full object-cover transition-opacity ${!slide.active ? 'opacity-30' : 'opacity-60'}`} 
                  muted 
                  onMouseOver={(e) => e.currentTarget.play()}
                  onMouseOut={(e) => e.currentTarget.pause()}
                />
              ) : (
                <Image src={slide.imageUrl} alt="" fill className={`object-cover transition-opacity ${!slide.active ? 'opacity-30' : 'opacity-60'}`} />
              )}
              <div className="absolute inset-0 flex items-center justify-center p-4 text-center">
                <p className="text-sm font-bold text-white">{isRtl ? slide.titleFa : slide.titleEn}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-zinc-950">
              <span className="text-xs text-zinc-500 font-mono">Order: {slide.order}</span>
              <div className="flex items-center gap-2">
                <button 
                  onClick={async () => await toggleHeroStatus(slide.id, slide.active)}
                  className={`p-2 rounded-lg transition-colors ${slide.active ? 'text-blue-500 hover:bg-blue-500/10' : 'text-zinc-500 hover:bg-zinc-500/10'}`}
                >
                  {slide.active ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button 
                  onClick={async () => {
                    if (confirm('Delete this slide?')) {
                      await deleteHeroSlide(slide.id, slide.imageUrl);
                      router.refresh();
                    }
                  }}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
