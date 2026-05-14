import { cache } from 'react';
import { createServerClient } from '@/lib/supabase/server';

// React `cache()` dedupes calls within a single render pass — `generateMetadata`
// and the page component both call this with the same slug; one DB round-trip.
export const getProjectBySlug = cache(async (slug: string) => {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching project:', error);
  }

  return data ?? null;
});
