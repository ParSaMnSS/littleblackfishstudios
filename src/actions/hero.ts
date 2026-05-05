'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

function extractStoragePath(url: string, bucket: string): string | null {
  const marker = `/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

function isSupabaseUrl(url: string): boolean {
  return url.includes('.supabase.co/storage/');
}

export async function createHeroSlide(formData: FormData) {
  try {
    const supabase = await createServerClient();
    const titleEn = (formData.get('titleEn') as string) || null;
    const titleFa = (formData.get('titleFa') as string) || null;
    const subtitleEn = (formData.get('subtitleEn') as string) || null;
    const subtitleFa = (formData.get('subtitleFa') as string) || null;
    const order = parseInt(formData.get('order') as string) || 0;
    const imageUrl = (formData.get('imageUrl') as string) || null;
    const youtubeUrl = (formData.get('youtubeUrl') as string) || null;

    if (!imageUrl && !youtubeUrl) throw new Error('Image or YouTube URL is required');

    const { error } = await supabase.from('HeroSlide').insert({
      title_en: titleEn,
      title_fa: titleFa,
      subtitle_en: subtitleEn,
      subtitle_fa: subtitleFa,
      image_url: imageUrl,
      youtube_url: youtubeUrl,
      order,
      active: true,
    });

    if (error) throw error;

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error('Create hero slide failed:', error);
    return { success: false, error: 'Failed to create slide' };
  }
}

export async function toggleHeroStatus(id: string, currentStatus: boolean) {
  try {
    const supabase = await createServerClient();

    const { error } = await supabase
      .from('HeroSlide')
      .update({ active: !currentStatus })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Toggle hero status failed:', error);
    return { success: false };
  }
}

export async function deleteHeroSlide(id: string, imageUrl: string) {
  try {
    const supabase = await createServerClient();

    const { error: deleteError } = await supabase.from('HeroSlide').delete().eq('id', id);
    if (deleteError) throw deleteError;

    if (imageUrl && isSupabaseUrl(imageUrl)) {
      const path = extractStoragePath(imageUrl, 'hero');
      if (path) {
        const { error: storageError } = await supabase.storage.from('hero').remove([path]);
        if (storageError) console.error('Failed to delete hero storage file:', storageError);
      }
    }

    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Delete hero slide failed:', error);
    return { success: false };
  }
}

export async function updateHeroSlide(id: string, formData: FormData) {
  try {
    const supabase = await createServerClient();
    const titleEn = (formData.get('titleEn') as string) || null;
    const titleFa = (formData.get('titleFa') as string) || null;
    const subtitleEn = (formData.get('subtitleEn') as string) || null;
    const subtitleFa = (formData.get('subtitleFa') as string) || null;
    const order = parseInt(formData.get('order') as string) || 0;
    const imageUrl = (formData.get('imageUrl') as string) || null;
    const youtubeUrl = (formData.get('youtubeUrl') as string) || null;

    const { error } = await supabase
      .from('HeroSlide')
      .update({
        title_en: titleEn,
        title_fa: titleFa,
        subtitle_en: subtitleEn,
        subtitle_fa: subtitleFa,
        image_url: imageUrl,
        youtube_url: youtubeUrl,
        order,
      })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error('Update hero slide failed:', error);
    return { success: false, error: 'Failed to update slide' };
  }
}
