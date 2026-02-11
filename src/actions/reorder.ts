'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateOrder(
  items: { id: string; order: number }[],
  model: 'project' | 'hero'
) {
  try {
    const updates = items.map((item) => {
      if (model === 'project') {
        return prisma.project.update({
          where: { id: item.id },
          data: { order: item.order },
        });
      } else {
        return prisma.heroSlide.update({
          where: { id: item.id },
          data: { order: item.order },
        });
      }
    });

    await prisma.$transaction(updates);

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin', 'page');
    
    return { success: true };
  } catch (error) {
    console.error(`Failed to update ${model} order:`, error);
    return { success: false, error: `Failed to update ${model} order` };
  }
}
