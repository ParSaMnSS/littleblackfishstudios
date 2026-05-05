'use server';

import { createServiceClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function updateOrder(
  items: { id: string; order: number }[],
  model: 'project' | 'hero'
) {
  try {
    const supabase = createServiceClient();
    const table = model === 'project' ? 'Project' : 'HeroSlide';

    const rows = items.map(({ id, order }) => ({ id, order }));

    const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });

    if (error) throw error;

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error(`Failed to update ${model} order:`, error);
    return { success: false, error: `Failed to update ${model} order` };
  }
}
