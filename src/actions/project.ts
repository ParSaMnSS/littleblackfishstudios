'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProject(id: string, formData: FormData) {
  try {
    const titleEn = formData.get('titleEn') as string;
    const titleFa = formData.get('titleFa') as string;
    const descEn = formData.get('descEn') as string;
    const descFa = formData.get('descFa') as string;
    const youtubeUrl = formData.get('youtubeUrl') as string;
    const slug = formData.get('slug') as string;
    const imageUrl = formData.get('image') as string;

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
