import { getYouTubeId } from '@/lib/youtube';

export function YouTubeEmbed({ url }: { url: string }) {
  const videoId = getYouTubeId(url);

  if (!videoId) return null;

  return (
    <div className="relative w-full overflow-hidden rounded-xl pt-[56.25%] shadow-2xl">
      <iframe
        className="absolute inset-0 h-full w-full"
        src={`https://www.youtube.com/embed/${videoId}?vq=hd1080&hd=1&rel=0&modestbranding=1&iv_load_policy=3`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
