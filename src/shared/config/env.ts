/**
 * Type-safe environment variable access with fallbacks
 */
export const ENV = {
  isProduction: process.env.NODE_ENV === 'production',
  siteUrl: (process.env.NEXT_PUBLIC_SITE_URL || 'https://citytourcabs.in').replace(/\/$/, ''),
  databaseUri: process.env.DATABASE_URI || '',
  payloadSecret: process.env.PAYLOAD_SECRET || '',
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY || '',
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET || '',
};
