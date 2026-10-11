import fs from 'fs'
import path from 'path'
import { createClient } from '@libsql/client'

async function applySchema() {
  console.log('=== APPLYING COMPLETE PAYLOAD CMS DDL SCHEMA ===')
  const dbPath = path.resolve(process.cwd(), 'data/citytourcabs.db')
  const client = createClient({ url: `file:${dbPath}` })

  // 1. Ensure required columns on existing tables first
  const addCol = async (table, col, type) => {
    try {
      const info = await client.execute(`PRAGMA table_info(${table})`)
      const exists = info.rows.some((r) => r.name === col)
      if (!exists) {
        await client.execute(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`)
        console.log(`+ Added ${table}.${col}`)
      }
    } catch (e) {
      // ignore
    }
  }

  // Fleet
  const fleetCols = [
    ['category', 'TEXT'],
    ['tag', 'TEXT'],
    ['seats', 'TEXT'],
    ['configuration', 'TEXT'],
    ['boot_space', 'TEXT'],
    ['luggage', 'TEXT'],
    ['ac_type', 'TEXT'],
    ['fuel_type', 'TEXT'],
    ['rate_per_km', 'TEXT'],
    ['local_full_day', 'TEXT'],
    ['image_url', 'TEXT'],
    ['image_id', 'INTEGER'],
    ['best_for', 'TEXT'],
    ['features', 'TEXT'],
    ['seating', 'TEXT'],
    ['ac', 'INTEGER DEFAULT 1'],
    ['base_rate', 'TEXT'],
  ]
  for (const [col, type] of fleetCols) await addCol('fleet', col, type)

  // Gallery
  await addCol('gallery', 'category', 'TEXT')
  await addCol('gallery', 'image_url', 'TEXT')
  await addCol('gallery', 'image_id', 'INTEGER')

  // Testimonials
  await addCol('testimonials', 'trip', 'TEXT')
  await addCol('testimonials', 'location', 'TEXT')
  await addCol('testimonials', 'date', 'TEXT')
  await addCol('testimonials', 'avatar', 'TEXT')
  await addCol('testimonials', 'text', 'TEXT')
  await addCol('testimonials', 'comment', 'TEXT')

  // Site Settings
  await addCol('site_settings', 'business_name', 'TEXT')
  await addCol('site_settings', 'phone', 'TEXT')
  await addCol('site_settings', 'help_phone', 'TEXT')
  await addCol('site_settings', 'email', 'TEXT')
  await addCol('site_settings', 'whatsapp', 'TEXT')
  await addCol('site_settings', 'chatbot_webhook_url', 'TEXT')
  await addCol('site_settings', 'logo_id', 'INTEGER')

  // Redirects
  await addCol('redirects', 'source', 'TEXT')
  await addCol('redirects', 'destination', 'TEXT')
  await addCol('redirects', 'permanent', 'INTEGER DEFAULT 1')

  // Tours & Pages
  for (const tbl of ['tours', 'pages']) {
    await addCol(tbl, 'seo_title', 'TEXT')
    await addCol(tbl, 'seo_description', 'TEXT')
    await addCol(tbl, 'seo_canonical', 'TEXT')
  }
  await addCol('tours', 'display_order', 'INTEGER DEFAULT 100')
  await addCol('tours', 'starting_price', 'TEXT')

  // 2. Read and apply drizzle generated SQL DDL statements
  const sqlFile = path.resolve(process.cwd(), 'drizzle_generated/0000_bitter_rhodey.sql')
  const sqlContent = fs.readFileSync(sqlFile, 'utf8')
  const statements = sqlContent
    .split('--> statement-breakpoint')
    .map((s) => s.trim())
    .filter(Boolean)

  let applied = 0
  for (let stmt of statements) {
    stmt = stmt
      .replace(/^CREATE TABLE /i, 'CREATE TABLE IF NOT EXISTS ')
      .replace(/^CREATE INDEX /i, 'CREATE INDEX IF NOT EXISTS ')
      .replace(/^CREATE UNIQUE INDEX /i, 'CREATE UNIQUE INDEX IF NOT EXISTS ')

    try {
      await client.execute(stmt)
      applied++
    } catch (err) {
      // index or table might already exist
    }
  }
  console.log(`✓ Applied ${applied} DDL statements to citytourcabs.db`)

  const bRes = await client.execute('SELECT count(*) as c FROM bookings')
  console.log(`✓ Historical customer bookings verified: ${bRes.rows[0].c}`)
}

applySchema().catch(console.error)
