'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function processImageUrl(imageUrl: string | null, youtubeUrl: string | null) {
  if ((!imageUrl || imageUrl.trim() === '') && youtubeUrl) {
    const videoId = getYouTubeId(youtubeUrl);
    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }
  return imageUrl;
}

// Extract the storage path from a Supabase public URL.
// URL shape: https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<path>
function extractStoragePath(url: string, bucket: string): string | null {
  const marker = `/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

function isSupabaseUrl(url: string): boolean {
  return url.includes('.supabase.co/storage/');
}

export async function createProject(data: {
  slug?: string;
  titleEn: string;
  titleFa: string;
  descriptionEn?: string;
  descriptionFa?: string;
  youtubeUrl?: string;
  imageUrl?: string;
  published: boolean;
  mediaType?: string;
  galleryUrls?: string[];
}) {
  try {
    const supabase = createServiceClient();
    const finalImageUrl = processImageUrl(data.imageUrl || null, data.youtubeUrl || null);
    const slug = `${generateSlug(data.titleEn)}-${Date.now()}`;

    const { error } = await supabase.from('projects').insert({
      slug,
      title_en: data.titleEn,
      title_fa: data.titleFa,
      description_en: data.descriptionEn ?? null,
      description_fa: data.descriptionFa ?? null,
      youtube_url: data.youtubeUrl ?? null,
      image_url: finalImageUrl,
      published: data.published,
      media_type: data.mediaType ?? 'youtube',
      gallery_urls: data.galleryUrls ?? [],
      order: 0,
    });

    if (error) throw error;

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to create project:', error);
    return { success: false, error: 'Failed to create project' };
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    const supabase = createServiceClient();
    const titleEn = formData.get('titleEn') as string;
    const titleFa = formData.get('titleFa') as string;
    const descriptionEn = formData.get('descriptionEn') as string;
    const descriptionFa = formData.get('descriptionFa') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;
    const imageUrl = formData.get('imageUrl') as string;
    const mediaType = (formData.get('mediaType') as string) || 'youtube';
    const galleryUrls: string[] = JSON.parse((formData.get('galleryUrls') as string) || '[]');

    const finalImageUrl = processImageUrl(imageUrl, youtubeUrl);
    const slug = generateSlug(titleEn);

    const { error } = await supabase.from('projects').update({
      title_en: titleEn,
      title_fa: titleFa,
      description_en: descriptionEn || null,
      description_fa: descriptionFa || null,
      youtube_url: youtubeUrl || null,
      image_url: finalImageUrl,
      slug,
      media_type: mediaType,
      gallery_urls: galleryUrls,
    }).eq('id', id);

    if (error) throw error;

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to update project:', error);
    return { success: false, error: 'Failed to update project' };
  }
}

export async function deleteProject(id: string) {
  try {
    const supabase = createServiceClient();

    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('image_url, gallery_urls')
      .eq('id', id)
      .single();

    if (fetchError || !project) {
      return { success: false, error: 'Project not found' };
    }

    // Collect all Supabase-hosted storage paths to delete
    const pathsToDelete: string[] = [];

    if (project.image_url && isSupabaseUrl(project.image_url)) {
      const path = extractStoragePath(project.image_url, 'projects');
      if (path) pathsToDelete.push(path);
    }

    const gallery: string[] = project.gallery_urls ?? [];
    for (const url of gallery) {
      if (url && isSupabaseUrl(url)) {
        const path = extractStoragePath(url, 'projects');
        if (path) pathsToDelete.push(path);
      }
    }

    if (pathsToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('projects')
        .remove(pathsToDelete);
      if (storageError) console.error('Failed to delete project storage files:', storageError);
    }

    const { error: deleteError } = await supabase.from('projects').delete().eq('id', id);
    if (deleteError) throw deleteError;

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete project:', error);
    return { success: false, error: 'Failed to delete project' };
  }
}
