import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const IMMUTABLE = 'public, max-age=31536000, immutable';
const HTML_EDGE = 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [{ key: 'Cache-Control', value: IMMUTABLE }],
      },
      {
        source: '/_next/image/:path*',
        headers: [{ key: 'Cache-Control', value: IMMUTABLE }],
      },
      {
        source: '/:all*.(woff|woff2|ttf|otf)',
        headers: [{ key: 'Cache-Control', value: IMMUTABLE }],
      },
      {
        source: '/:all*.(png|jpg|jpeg|webp|avif|svg|ico)',
        headers: [{ key: 'Cache-Control', value: IMMUTABLE }],
      },
      {
        source: '/((?!admin|api|_next).*)',
        headers: [{ key: 'Cache-Control', value: HTML_EDGE }],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
