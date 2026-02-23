'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleProjectStatus(id: string, currentStatus: boolean) {
  try {
    await prisma.project.update({
      where: { id },
      data: { published: !currentStatus },
    });

    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle project status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
