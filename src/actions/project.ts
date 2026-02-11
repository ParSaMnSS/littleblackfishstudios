'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { put, del } from '@vercel/blob';

export async function updateProject(id: string, formData: FormData) {
  try {
    const titleEn = formData.get('titleEn') as string;
    const titleFa = formData.get('titleFa') as string;
    const descEn = formData.get('descEn') as string;
    const descFa = formData.get('descFa') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;
    const slug = formData.get('slug') as string;
    const file = formData.get('file') as File | null;
    const currentImageUrl = formData.get('currentImageUrl') as string;

    let imageUrl = currentImageUrl;

    // Only upload if a new file is provided and has a name (is a valid file)
    if (file && file.size > 0) {
      // 1. Delete old image if it exists in blob
      if (currentImageUrl && currentImageUrl.includes('public.blob.vercel-storage.com')) {
        try {
          await del(currentImageUrl);
        } catch (e) {
          console.error("Failed to delete old blob:", e);
        }
      }

      // 2. Upload new image
      const blob = await put(file.name, file, { access: 'public' });
      imageUrl = blob.url;
    }

    await prisma.project.update({
      where: { id },
      data: {
        titleEn,
        titleFa,
        descEn,
        descFa,
        youtubeUrl,
        slug,
        image: imageUrl
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
