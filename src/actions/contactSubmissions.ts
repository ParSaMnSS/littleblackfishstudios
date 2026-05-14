'use server';

import { createServiceClient, requireAdminUser } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function setSubmissionRead(id: string, read: boolean) {
  await requireAdminUser();
  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from('contact_submissions')
      .update({ read })
      .eq('id', id);
    if (error) throw error;
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to update submission read state:', error);
    return { success: false, error: 'Failed to update submission' };
  }
}

export async function deleteSubmission(id: string) {
  await requireAdminUser();
  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from('contact_submissions')
      .delete()
      .eq('id', id);
    if (error) throw error;
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete submission:', error);
    return { success: false, error: 'Failed to delete submission' };
  }
}
