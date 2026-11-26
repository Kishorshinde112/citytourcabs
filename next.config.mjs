import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  experimental: {
    inlineCss: true,
  },
  webpack: (config, { dev, isServer, webpack }) => {
    // Next 15's SWC async-to-generator transform on fetch-server-response leaves
    // require('../../dev/hot-reloader/app/hot-reloader-app') visible to Webpack's parser
    // before minification, pulling ~800KB of next-devtools into rootMainFiles.
    if (!dev && !isServer) {
      config.plugins.push(
        new webpack.IgnorePlugin({
          resourceRegExp: /hot-reloader[\\/]app[\\/]hot-reloader-app|next-devtools/,
        })
      );
    }
    return config;
  },
  images: {
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 2592000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: '**.cloudflarestorage.com',
      },
      {
        protocol: 'https',
        hostname: 'citytourcabs.in',
      },
      {
        protocol: 'https',
        hostname: 'cabs.kishorlab.dev',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ]

    if (process.env.NODE_ENV === 'production') {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains',
      })
    }

    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/:path*', has: [{ type: 'host', value: 'www.citytourcabs.in' }], destination: 'https://citytourcabs.in/:path*', permanent: true },
      { source: '/:path*', has: [{ type: 'host', value: 'cabs.kishorlab.dev' }], destination: 'https://citytourcabs.in/:path*', permanent: true },
      { source: '/mumbai-darshan', destination: '/tours/mumbai-darshan', permanent: true },
      { source: '/mumbai-darshan-cab-service', destination: '/tours/mumbai-darshan', permanent: true },
      { source: '/lonavala-trip', destination: '/tours/lonavala-trip', permanent: true },
      { source: '/alibaug-sightseeing', destination: '/tours/alibaug-sightseeing', permanent: true },
      { source: '/matheran-sightseeing', destination: '/tours/matheran-sightseeing', permanent: true },
      { source: '/shirdi-tour', destination: '/tours/shirdi-tour', permanent: true },
      { source: '/mahabaleshwar-sightseeing', destination: '/tours/mahabaleshwar-sightseeing', permanent: true },
      { source: '/igatpuri-tour', destination: '/tours/igatpuri-tour', permanent: true },
      { source: '/ashtavinayak', destination: '/tours/ashtavinayak', permanent: true },
      { source: '/3-jyotirlinga-in-maharashtra', destination: '/tours/3-jyotirlinga-in-maharashtra', permanent: true },
      { source: '/konkan-darshan', destination: '/tours/konkan-darshan', permanent: true },
      { source: '/inquiry-confirmed', destination: '/enquiry-confirmed', permanent: true },
    ]
  },
}

const payloadConfig = withPayload(nextConfig)

// Scope Payload's Accept-CH / Critical-CH / Vary header rule to /admin only so public
// marketing pages avoid a 307 client-hint round-trip on first load.
const originalPayloadHeaders = payloadConfig.headers
payloadConfig.headers = async () => {
  const rules = originalPayloadHeaders ? await originalPayloadHeaders() : []
  return rules.map((rule) =>
    rule.source === '/:path*'
      ? {
          ...rule,
          source: '/admin/:path*',
        }
      : rule
  )
}

export default payloadConfig
