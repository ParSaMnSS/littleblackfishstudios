'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

export async function createProject(data: {
  slug: string;
  titleEn: string;
  titleFa: string;
  descriptionEn?: string;
  descriptionFa?: string;
  youtubeUrl?: string;
  imageUrl?: string;
  published: boolean;
}) {
  try {
    const finalImageUrl = processImageUrl(data.imageUrl || null, data.youtubeUrl || null);

    const project = await prisma.project.create({
      data: {
        ...data,
        imageUrl: finalImageUrl,
      },
    });

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true, project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProject(id: string, formData: FormData) {
  try {
    const titleEn = formData.get('titleEn') as string;
    const titleFa = formData.get('titleFa') as string;
    const descriptionEn = formData.get('descriptionEn') as string;
    const descriptionFa = formData.get('descriptionFa') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;
    const slug = formData.get('slug') as string;
    const imageUrl = formData.get('imageUrl') as string;

    const finalImageUrl = processImageUrl(imageUrl, youtubeUrl);

    await prisma.project.update({
      where: { id },
      data: {
        titleEn,
        titleFa,
        descriptionEn,
        descriptionFa,
        youtubeUrl,
        slug,
        imageUrl: finalImageUrl
      },
    });

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error("Failed to update project:", error);
    return { success: false, error: "Failed to update project" };
  }
}
