'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateOrder(
  items: { id: string; order: number }[],
  model: 'project' | 'hero'
) {
  try {
    const supabase = createServiceClient();
    const table = model === 'project' ? 'projects' : 'hero_slides';

    const rows = items.map(({ id, order }) => ({ id, order }));

    const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });

    if (error) throw error;

    revalidatePath('/en', 'page');
    revalidatePath('/fa', 'page');
    revalidatePath('/en/admin', 'page');
    revalidatePath('/fa/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error(`Failed to update ${model} order:`, error);
    return { success: false, error: `Failed to update ${model} order` };
  }
}
