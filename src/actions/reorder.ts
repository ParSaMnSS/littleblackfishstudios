'use server';

import { createServiceClient, requireAdminUser } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateOrder(
  items: { id: string; order: number }[],
  model: 'project' | 'hero'
) {
  await requireAdminUser();
  try {
    const supabase = createServiceClient();
    const table = model === 'project' ? 'projects' : 'hero_slides';

    const results = await Promise.all(
      items.map(({ id, order }) =>
        supabase.from(table).update({ order }).eq('id', id)
      )
    );

    const firstError = results.find((r) => r.error)?.error;
    if (firstError) {
      console.error(`Failed to update ${model} order:`, firstError);
      return { success: false, error: firstError.message };
    }

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error(`Failed to update ${model} order:`, error);
    return { success: false, error: `Failed to update ${model} order` };
  }
}
