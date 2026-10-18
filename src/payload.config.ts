import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'


import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Bookings } from './collections/Bookings'
import { Tours, Pages } from './collections/PagesAndTours'
import { Fleet, Gallery, Testimonials, FAQs, Redirects } from './collections/MiscCollections'
import { SiteSettings, Navigation, Footer } from './globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (process.env.NODE_ENV === 'production' && !process.env.PAYLOAD_SECRET) {
  throw new Error('PAYLOAD_SECRET must be set in production');
}

const rawDbUri = process.env.DATABASE_URI || 'file:./data/citytourcabs.db'
const isPostgres = rawDbUri.startsWith('postgres://') || rawDbUri.startsWith('postgresql://')

const dbUri = (() => {
  if (rawDbUri.startsWith('file:')) {
    const rawPath = rawDbUri.replace(/^file:/, '')
    if (!path.isAbsolute(rawPath)) {
      return `file:${path.resolve(process.cwd(), rawPath)}`
    }
  }
  return rawDbUri
})()

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'https://citytourcabs.in',
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' - City Tour Cabs Admin',
      icons: '/favicon.png',
      openGraph: {
        images: '/logo.png',
      },
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo#Logo',
        Icon: '@/components/admin/Icon#Icon',
      },
      Nav: '@/components/admin/AdminNav#AdminNav',
      views: {
        dashboard: {
          Component: '@/components/admin/DashboardView#DashboardView',
        },
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor(),
  collections: [Users, Media, Tours, Pages, Bookings, Fleet, Gallery, Testimonials, FAQs, Redirects],
  globals: [SiteSettings, Navigation, Footer],
  db: isPostgres
    ? postgresAdapter({
        pool: {
          connectionString: dbUri,
          ssl: { rejectUnauthorized: false },
        },
        push: process.env.NODE_ENV !== 'production' || process.env.DB_PUSH === 'true',
      })
    : sqliteAdapter({
        client: {
          url: dbUri,
        },
        push: false,
      }),
  secret: process.env.PAYLOAD_SECRET || (process.env.NODE_ENV === 'production' ? '' : 'local-dev-only-change-me'),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
