'use server';

import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';

export async function signOut(locale: string = 'en') {
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect(`/${locale}/login`);
}
