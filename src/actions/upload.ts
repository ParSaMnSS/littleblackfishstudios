'use server';

import { put } from '@vercel/blob';

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  
  if (!file) {
    throw new Error('No file provided');
  }

  // Upload to Vercel Blob
  const blob = await put(file.name, file, {
    access: 'public',
  });

  return blob.url;
}
