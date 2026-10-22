import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'


import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Bookings } from './collections/Bookings'
import { Tours, Pages } from './collections/PagesAndTours'
import { Fleet, Gallery, Testimonials, FAQs, Redirects } from './collections/MiscCollections'
import { SiteSettings, Navigation, Footer } from './globals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build'
const isProductionRuntime =
  process.env.NODE_ENV === 'production' && !isBuildPhase

const configuredDbUri = (process.env.DATABASE_URI || '').trim()

// Production runtime must use PostgreSQL. The build phase is exempt because
// the Docker builder intentionally has no production database credentials;
// the fallback SQLite file is never used by a production server at runtime.
if (isProductionRuntime && !configuredDbUri) {
  throw new Error(
    'DATABASE_URI must be set in production. Refusing to fall back to SQLite; set DATABASE_URI to the production PostgreSQL connection string.',
  )
}

if (
  isProductionRuntime &&
  !/^postgres(ql)?:\/\//i.test(configuredDbUri)
) {
  throw new Error(
    'Production DATABASE_URI must be a PostgreSQL connection string (postgres:// or postgresql://). SQLite and other database URLs are not supported in production.',
  )
}

if (process.env.NODE_ENV === 'production' && !process.env.PAYLOAD_SECRET && !isBuildPhase) {
  throw new Error('PAYLOAD_SECRET must be set in production');
}

const rawDbUri = configuredDbUri || 'file:./data/citytourcabs.db'
const isPostgres = /^postgres(ql)?:\/\//i.test(rawDbUri)

const dbUri = (() => {
  if (rawDbUri.startsWith('file:')) {
    const rawPath = rawDbUri.replace(/^file:/, '')
    if (!path.isAbsolute(rawPath)) {
      return `file:${path.resolve(process.cwd(), rawPath)}`
    }
    return rawDbUri
  }
  // If Supabase direct domain is specified, automatically route to the IPv4 pooler
  // to avoid IPv6 ENETUNREACH issues on environments without IPv6 transit
  if (rawDbUri.includes('db.ttvmkvvnpwgtwtwlzjig.supabase.co')) {
    return rawDbUri
      .replace('://postgres:', '://postgres.ttvmkvvnpwgtwtwlzjig:')
      .replace('db.ttvmkvvnpwgtwtwlzjig.supabase.co', 'aws-0-ap-south-1.pooler.supabase.com')
  }
  return rawDbUri
})()

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://citytourcabs.in'
const csrfOrigins = [serverURL]

// Localhost is a development convenience only; never widen production CSRF.
if (process.env.NODE_ENV !== 'production') {
  csrfOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000')
}

// Supabase's pooler can present a self-signed chain. Keep the legacy fallback
// until DB_SSL_CA is configured, then verify the full chain against that CA.
const dbSsl = process.env.DB_SSL_CA
  ? { ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n'), rejectUnauthorized: true }
  : { rejectUnauthorized: false }

export default buildConfig({
  serverURL,
  csrf: csrfOrigins,
  sharp,
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
          ssl: dbSsl,
        },
        push: process.env.DB_PUSH === 'true',
      })
    : sqliteAdapter({
        client: {
          url: dbUri,
        },
        push: process.env.NODE_ENV !== 'production' || process.env.DB_PUSH === 'true',
      }),
  secret:
    process.env.PAYLOAD_SECRET ||
    (isBuildPhase
      ? 'build-phase-placeholder-not-used-at-runtime'
      : process.env.NODE_ENV === 'production'
        ? ''
        : 'local-dev-only-change-me'),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
