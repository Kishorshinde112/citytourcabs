import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
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
    ],
  },
  async rewrites() {
    return [
      { source: '/mumbai-darshan', destination: '/tours/mumbai-darshan' },
      { source: '/mumbai-darshan-cab-service', destination: '/tours/mumbai-darshan' },
      { source: '/lonavala-trip', destination: '/tours/lonavala-trip' },
      { source: '/alibaug-sightseeing', destination: '/tours/alibaug-sightseeing' },
      { source: '/matheran-sightseeing', destination: '/tours/matheran-sightseeing' },
      { source: '/shirdi-tour', destination: '/tours/shirdi-tour' },
      { source: '/mahabaleshwar-sightseeing', destination: '/tours/mahabaleshwar-sightseeing' },
      { source: '/igatpuri-tour', destination: '/tours/igatpuri-tour' },
      { source: '/ashtavinayak', destination: '/tours/ashtavinayak' },
      { source: '/3-jyotirlinga-in-maharashtra', destination: '/tours/3-jyotirlinga-in-maharashtra' },
      { source: '/konkan-darshan', destination: '/tours/konkan-darshan' },
    ]
  },
}

export default withPayload(nextConfig)
