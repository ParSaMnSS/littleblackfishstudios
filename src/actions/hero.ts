'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { del } from '@vercel/blob';

export async function createHeroSlide(formData: FormData) {
  try {
    const titleEn = formData.get('titleEn') as string;
    const titleFa = formData.get('titleFa') as string;
    const subtitleEn = formData.get('subtitleEn') as string;
    const subtitleFa = formData.get('subtitleFa') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    const imageUrl = formData.get('imageUrl') as string;

    if (!imageUrl) throw new Error('Image is required');

    // Save to DB
    await prisma.heroSlide.create({
      data: {
        titleEn,
        titleFa,
        subtitleEn,
        subtitleFa,
        imageUrl,
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
    await del(imageUrl);

    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Delete hero slide failed:', error);
    return { success: false };
  }
}

export async function updateHeroSlide(id: string, formData: FormData) {
  try {
    const titleEn = formData.get('titleEn') as string;
    const titleFa = formData.get('titleFa') as string;
    const subtitleEn = formData.get('subtitleEn') as string;
    const subtitleFa = formData.get('subtitleFa') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    const imageUrl = formData.get('imageUrl') as string;

    await prisma.heroSlide.update({
      where: { id },
      data: {
        titleEn,
        titleFa,
        subtitleEn,
        subtitleFa,
        imageUrl,
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
