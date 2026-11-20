import path from 'path';
import { fileURLToPath } from 'url';
import { buildConfig } from 'payload';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';

import {
  Users,
  Media,
  Bookings,
  Tours,
  Pages,
  Fleet,
  Gallery,
  Testimonials,
  FAQs,
  Redirects,
} from './collections';
import { SiteSettings, Navigation, Footer } from './globals';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const srcDir = path.resolve(dirname, '..');

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';
const isProductionRuntime =
  process.env.NODE_ENV === 'production' && !isBuildPhase;

const configuredDbUri = (process.env.DATABASE_URI || '').trim();

if (isProductionRuntime && !configuredDbUri) {
  throw new Error(
    'DATABASE_URI must be set in production. Refusing to fall back to SQLite; set DATABASE_URI to the production PostgreSQL connection string.'
  );
}

if (isProductionRuntime && !/^postgres(ql)?:\/\//i.test(configuredDbUri)) {
  throw new Error(
    'Production DATABASE_URI must be a PostgreSQL connection string (postgres:// or postgresql://). SQLite and other database URLs are not supported in production.'
  );
}

if (process.env.NODE_ENV === 'production' && !process.env.PAYLOAD_SECRET && !isBuildPhase) {
  throw new Error('PAYLOAD_SECRET must be set in production');
}

const rawDbUri = configuredDbUri || 'file:./data/citytourcabs.db';
const isPostgres = /^postgres(ql)?:\/\//i.test(rawDbUri);

const dbUri = (() => {
  if (rawDbUri.startsWith('file:')) {
    const rawPath = rawDbUri.replace(/^file:/, '');
    if (!path.isAbsolute(rawPath)) {
      return `file:${path.resolve(process.cwd(), rawPath)}`;
    }
    return rawDbUri;
  }
  if (rawDbUri.includes('db.ttvmkvvnpwgtwtwlzjig.supabase.co')) {
    return rawDbUri
      .replace('://postgres:', '://postgres.ttvmkvvnpwgtwtwlzjig:')
      .replace('db.ttvmkvvnpwgtwtwlzjig.supabase.co', 'aws-0-ap-south-1.pooler.supabase.com');
  }
  return rawDbUri;
})();

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://citytourcabs.in';
const csrfOrigins = [serverURL];

if (process.env.NODE_ENV !== 'production') {
  csrfOrigins.push('http://localhost:3000', 'http://127.0.0.1:3000');
}

const dbSsl = process.env.DB_SSL_CA
  ? { ca: process.env.DB_SSL_CA.replace(/\\n/g, '\n'), rejectUnauthorized: true }
  : { rejectUnauthorized: false };

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
      baseDir: srcDir,
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
    outputFile: path.resolve(srcDir, 'payload-types.ts'),
  },
});
