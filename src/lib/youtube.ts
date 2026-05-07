const YOUTUBE_RE =
  /(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=))([\w\-]{11})/;

export function getYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.match(YOUTUBE_RE)?.[1] ?? null;
}

/** Returns a 320×180 thumbnail URL, or null if the URL is not a valid YouTube link. */
export function getYouTubeThumbnail(url: string | null | undefined): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : null;
}

/** Returns a high-resolution (1280×720) thumbnail URL, or null. */
export function getYouTubeMaxResThumbnail(url: string | null | undefined): string | null {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/maxresdefault.jpg` : null;
}
