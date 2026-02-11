'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { del, put } from '@vercel/blob';

export async function createHeroSlide(formData: FormData) {
  try {
    const file = formData.get('file') as File;
    const titleEn = formData.get('titleEn') as string;
    const titleFa = formData.get('titleFa') as string;
    const subtitleEn = formData.get('subtitleEn') as string;
    const subtitleFa = formData.get('subtitleFa') as string;
    const order = parseInt(formData.get('order') as string) || 0;

    if (!file) throw new Error('Image is required');

    // 1. Upload to Blob
    const blob = await put(file.name, file, { access: 'public' });

    // 2. Save to DB
    await prisma.heroSlide.create({
      data: {
        titleEn,
        titleFa,
        subtitleEn,
        subtitleFa,
        imageUrl: blob.url,
        order,
        active: true,
      },
    });

    revalidatePath('/[locale]', 'layout');
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
    await del(imageUrl);

    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Delete hero slide failed:', error);
    return { success: false };
  }
}
