'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { del } from '@vercel/blob';

export async function createHeroSlide(formData: FormData) {
  try {
    const titleEn = formData.get('titleEn') as string || null;
    const titleFa = formData.get('titleFa') as string || null;
    const subtitleEn = formData.get('subtitleEn') as string || null;
    const subtitleFa = formData.get('subtitleFa') as string || null;
    const order = parseInt(formData.get('order') as string) || 0;
    const imageUrl = formData.get('imageUrl') as string || null;
    const youtubeUrl = formData.get('youtubeUrl') as string || null;

    if (!imageUrl && !youtubeUrl) throw new Error('Image or YouTube URL is required');

    // Save to DB
    await prisma.heroSlide.create({
      data: {
        titleEn,
        titleFa,
        subtitleEn,
        subtitleFa,
        imageUrl,
        youtubeUrl,
        order,
        active: true,
      },
    });

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
    await prisma.heroSlide.update({
      where: { id },
      data: { active: !currentStatus },
    });

    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Toggle hero status failed:', error);
    return { success: false };
  }
}

export async function deleteHeroSlide(id: string, imageUrl: string) {
  try {
    // 1. Delete from DB
    await prisma.heroSlide.delete({ where: { id } });

    // 2. Delete from Vercel Blob
    if (imageUrl && imageUrl.includes('vercel-storage.com')) {
      try {
        await del(imageUrl);
      } catch (e) {
        console.error("Failed to delete hero blob:", e);
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
    const titleEn = formData.get('titleEn') as string || null;
    const titleFa = formData.get('titleFa') as string || null;
    const subtitleEn = formData.get('subtitleEn') as string || null;
    const subtitleFa = formData.get('subtitleFa') as string || null;
    const order = parseInt(formData.get('order') as string) || 0;
    const imageUrl = formData.get('imageUrl') as string || null;
    const youtubeUrl = formData.get('youtubeUrl') as string || null;

    await prisma.heroSlide.update({
      where: { id },
      data: {
        titleEn,
        titleFa,
        subtitleEn,
        subtitleFa,
        imageUrl,
        youtubeUrl,
        order,
      },
    });

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error('Update hero slide failed:', error);
    return { success: false, error: 'Failed to update slide' };
  }
}
