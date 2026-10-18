import { Client } from 'pg';
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

// 1. Load Cloudinary URLs
const cloudinaryCachePath = path.join(process.cwd(), 'scripts', 'cloudinary_urls.json');
const cloudinaryUrls = new Map(Object.entries(JSON.parse(fs.readFileSync(cloudinaryCachePath, 'utf8'))).map(([k, v]) => [Number(k), v]));
console.log(`Loaded ${cloudinaryUrls.size} Cloudinary URLs from cache.`);

// 2. Configure PostgreSQL Client
const password = encodeURIComponent('Nishantmansi@2023');
const pg = new Client({
  connectionString: process.env.DATABASE_URI || `postgresql://postgres:${password}@db.ttvmkvvnpwgtwtwlzjig.supabase.co:5432/postgres`,
  ssl: { rejectUnauthorized: false },
});

// 3. Open SQLite Database Archive
const sqlite = new DatabaseSync('data/citytourcabs.db');

async function migrate() {
  console.log('🚀 Starting Supabase PostgreSQL Migration...');
  await pg.connect();
  console.log('✅ Connected to Supabase PostgreSQL');

  // STEP B: Migrate Database Tables to Supabase
  console.log('\n🗄️ Step B: Migrating CMS Tables to Supabase PostgreSQL...');

  // Get table information from Supabase
  const pgTablesRes = await pg.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;"
  );
  const pgTables = pgTablesRes.rows.map((r) => r.table_name);

  // Get boolean columns and jsonb columns
  const boolColsRes = await pg.query(
    "SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public' AND data_type = 'boolean';"
  );
  const boolCols = new Set(boolColsRes.rows.map((r) => `${r.table_name}.${r.column_name}`));

  const jsonbColsRes = await pg.query(
    "SELECT table_name, column_name FROM information_schema.columns WHERE table_schema = 'public' AND data_type IN ('json', 'jsonb');"
  );
  const jsonbCols = new Set(jsonbColsRes.rows.map((r) => `${r.table_name}.${r.column_name}`));

  // List of tables to migrate in order
  const tablesToMigrate = [
    'users',
    'users_sessions',
    'media',
    'site_settings',
    'navigation',
    'navigation_links',
    'footer',
    'footer_groups',
    'footer_groups_links',
    'tours',
    'tours_blocks_tour_details',
    'tours_blocks_tour_details_attractions',
    'tours_blocks_tour_details_rate_columns',
    'tours_blocks_tour_details_rates',
    'tours_blocks_tour_details_rules',
    'pages',
    'pages_blocks_hero',
    'pages_blocks_why_choose_us',
    'pages_blocks_testimonials',
    'pages_blocks_faq',
    'pages_blocks_about',
    'pages_blocks_fleet',
    'pages_blocks_gallery',
    'pages_blocks_booking_contact_form',
    'pages_blocks_tour_grid',
    'fleet',
    'testimonials',
    'faqs',
    'gallery',
    'redirects',
    'payload_preferences',
    'payload_preferences_rels',
  ];

  await pg.query('BEGIN;');
  await pg.query("SET session_replication_role = 'replica';");

  try {
    for (const tableName of tablesToMigrate) {
      if (!pgTables.includes(tableName)) {
        continue;
      }

      // Check if table exists in SQLite
      const sqTableCheck = sqlite
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?;")
        .get(tableName);
      if (!sqTableCheck) {
        continue;
      }

      const sqRows = sqlite.prepare(`SELECT * FROM "${tableName}";`).all();
      if (sqRows.length === 0) {
        continue;
      }

      // Fetch Postgres columns for this table
      const pgColsRes = await pg.query(
        `SELECT column_name FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '${tableName}' ORDER BY ordinal_position;`
      );
      const pgCols = pgColsRes.rows.map((r) => r.column_name);

      // Clean existing rows in Postgres to avoid duplicate keys
      await pg.query(`DELETE FROM "${tableName}";`);

      for (const row of sqRows) {
        // Special case: media table Cloudinary URLs
        if (tableName === 'media' && cloudinaryUrls.has(row.id)) {
          row.url = cloudinaryUrls.get(row.id);
          row.thumbnail_u_r_l = cloudinaryUrls.get(row.id);
        }

        // Special case: testimonials text column not-null requirement
        if (tableName === 'testimonials') {
          row.text = row.text || row.comment || 'Great service with City Tour Cabs!';
          row.comment = row.comment || row.text;
        }

        // Filter keys present in PostgreSQL
        const insertCols = [];
        const insertVals = [];
        const valuePlaceholders = [];

        let idx = 1;
        for (const [key, val] of Object.entries(row)) {
          if (pgCols.includes(key)) {
            insertCols.push(`"${key}"`);
            let cleanVal = val;

            // Handle boolean
            if (boolCols.has(`${tableName}.${key}`)) {
              cleanVal = cleanVal === 1 || cleanVal === '1' || cleanVal === true;
            }

            // Handle JSON/JSONB
            if (jsonbCols.has(`${tableName}.${key}`) && typeof cleanVal === 'string') {
              try {
                cleanVal = JSON.parse(cleanVal);
              } catch (_) {}
            }

            insertVals.push(cleanVal);
            valuePlaceholders.push(`$${idx}`);
            idx++;
          }
        }

        if (insertCols.length > 0) {
          const sql = `INSERT INTO "${tableName}" (${insertCols.join(', ')}) VALUES (${valuePlaceholders.join(', ')});`;
          await pg.query(sql, insertVals);
        }
      }

      console.log(`  ✅ Migrated table '${tableName}': ${sqRows.length} rows inserted.`);
    }

    // Explicitly confirm bookings table is ready and clean
    const bookingsCount = await pg.query('SELECT count(*) as count FROM "bookings";');
    console.log(`\n📋 Bookings table status in Supabase: ${bookingsCount.rows[0].count} rows (clean structure ready for new leads).`);

    await pg.query("SET session_replication_role = 'origin';");
    await pg.query('COMMIT;');
    console.log('\n🎉 ALL CMS CONTENT AND CLOUDINARY MEDIA MIGRATED SUCCESSFULLY TO SUPABASE!');
  } catch (err) {
    await pg.query('ROLLBACK;');
    console.error('\n❌ Migration failed during database transaction:', err);
    throw err;
  } finally {
    await pg.end();
  }
}

migrate().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
});
