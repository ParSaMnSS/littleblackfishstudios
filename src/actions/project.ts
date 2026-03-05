'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-') // Replace spaces and special chars with hyphens
    .replace(/(^-|-$)+/g, '');   // Remove leading or trailing hyphens
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
    const finalImageUrl = processImageUrl(data.imageUrl || null, data.youtubeUrl || null);
    const slug = generateSlug(data.titleEn);

    const project = await prisma.project.create({
      data: {
        ...data,
        slug,
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
    const imageUrl = formData.get('imageUrl') as string;
    const mediaType = formData.get('mediaType') as string || 'youtube';
    const galleryUrls = JSON.parse(formData.get('galleryUrls') as string || '[]');

    const finalImageUrl = processImageUrl(imageUrl, youtubeUrl);
    const slug = generateSlug(titleEn);

    await prisma.project.update({
      where: { id },
      data: {
        titleEn,
        titleFa,
        descriptionEn,
        descriptionFa,
        youtubeUrl,
        slug,
        imageUrl: finalImageUrl,
        mediaType,
        galleryUrls
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

export async function deleteProject(id: string) {
  try {
    // 1. Fetch project to get imageUrl for cleanup
    const project = await prisma.project.findUnique({
      where: { id },
      select: { imageUrl: true }
    });

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // 2. Delete the image if it's hosted on Vercel Blob
    if (project.imageUrl && project.imageUrl.includes('vercel-storage.com')) {
      const { del } = await import('@vercel/blob');
      try {
        await del(project.imageUrl);
      } catch (e) {
        console.error("Failed to delete blob:", e);
      }
    }

    // 3. Delete from database
    await prisma.project.delete({
      where: { id },
    });

    // 4. Revalidate cache
    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin', 'page');
    
    return { success: true };
  } catch (error) {
    console.error("Failed to delete project:", error);
    return { success: false, error: "Failed to delete project" };
  }
}
