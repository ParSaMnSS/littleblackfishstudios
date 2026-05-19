import Image from 'next/image';
import { Play, ExternalLink } from 'lucide-react';
import { getYouTubeId, getYouTubeThumbnail } from '@/lib/youtube';

const URL_RE = /(https?:\/\/[^\s<>"']+)/g;

type Variant = 'card' | 'inline';

function prettyHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function YouTubeLinkCard({ url }: { url: string }) {
  const thumb = getYouTubeThumbnail(url);
  if (!thumb) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="my-3 flex w-full max-w-md items-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-zinc-900/60 p-2 transition-colors hover:border-blue-500/40 hover:bg-zinc-900"
    >
      <div className="relative aspect-video w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-950 sm:w-32">
        <Image
          src={thumb}
          alt=""
          fill
          sizes="(max-width: 640px) 96px, 128px"
          className="object-cover"
          unoptimized
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
          <Play size={18} className="fill-white text-white" />
        </div>
      </div>
      <div className="min-w-0 flex-1 pr-2">
        <div className="truncate text-sm font-medium text-zinc-100">
          {prettyHost(url)}
        </div>
        <div className="text-xs text-zinc-500">YouTube</div>
      </div>
    </a>
  );
}

function PlainLink({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-baseline gap-0.5 text-blue-400 underline decoration-blue-500/40 underline-offset-2 transition-colors hover:text-blue-300 hover:decoration-blue-400"
    >
      <span className="break-all">{url}</span>
      <ExternalLink size={12} className="shrink-0 translate-y-0.5" />
    </a>
  );
}

export function RichText({
  text,
  variant = 'card',
}: {
  text: string | null | undefined;
  variant?: Variant;
}) {
  if (!text) return null;
  const parts = text.split(URL_RE);
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) {
          return part ? <span key={i}>{part}</span> : null;
        }
        if (variant === 'card' && getYouTubeId(part)) {
          return <YouTubeLinkCard key={i} url={part} />;
        }
        return <PlainLink key={i} url={part} />;
      })}
    </>
  );
}
