'use server';

import { createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleProjectStatus(id: string, currentStatus: boolean) {
  try {
    const supabase = await createServerClient();

    const { error } = await supabase
      .from('Project')
      .update({ published: !currentStatus })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/[locale]', 'layout');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle project status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}
