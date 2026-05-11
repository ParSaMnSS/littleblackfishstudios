'use server';

import { createServiceClient, requireAdminUser } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function createCategory(data: { nameEn: string; nameFa: string }) {
  await requireAdminUser();
  try {
    const supabase = createServiceClient();
    const slug = `${generateSlug(data.nameEn) || 'category'}-${Date.now()}`;

    const { error } = await supabase.from('categories').insert({
      slug,
      name_en: data.nameEn,
      name_fa: data.nameFa,
      order: 0,
      visible: true,
    });

    if (error) throw error;

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to create category:', error);
    return { success: false, error: 'Failed to create category' };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdminUser();
  try {
    const supabase = createServiceClient();
    const nameEn = formData.get('nameEn') as string;
    const nameFa = formData.get('nameFa') as string;

    if (!nameEn || !nameFa) {
      return { success: false, error: 'Both names are required' };
    }

    const { error } = await supabase
      .from('categories')
      .update({
        name_en: nameEn,
        name_fa: nameFa,
        slug: generateSlug(nameEn),
      })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to update category:', error);
    return { success: false, error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  await requireAdminUser();
  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete category:', error);
    return { success: false, error: 'Failed to delete category' };
  }
}

export async function toggleCategoryVisibility(id: string, currentVisible: boolean) {
  await requireAdminUser();
  try {
    const supabase = createServiceClient();
    const { error } = await supabase
      .from('categories')
      .update({ visible: !currentVisible })
      .eq('id', id);

    if (error) throw error;

    revalidatePath('/[locale]', 'layout');
    revalidatePath('/[locale]/admin', 'page');
    return { success: true };
  } catch (error) {
    console.error('Failed to toggle category visibility:', error);
    return { success: false };
  }
}
