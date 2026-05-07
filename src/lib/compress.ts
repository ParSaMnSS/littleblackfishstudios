export async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  const imageCompression = (await import('browser-image-compression')).default;

  const compressed = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 2560,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.85,
  });

  const baseName = file.name.replace(/\.[^.]+$/, '');
  return new File([compressed], `${baseName}.webp`, { type: 'image/webp' });
}
