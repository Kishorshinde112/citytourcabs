import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_slides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image\` text NOT NULL,
  	\`subtitle\` text,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`button_text\` text,
  	\`link\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`pages_slides_order_idx\` ON \`pages_slides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_slides_parent_id_idx\` ON \`pages_slides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`pages\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`hero_title\` text,
  	\`hero_subtitle\` text,
  	\`hero_background_image\` text,
  	\`hero_badge\` text,
  	\`about_content_welcome_title\` text,
  	\`about_content_welcome_description\` text,
  	\`about_content_driver_image\` text,
  	\`about_content_stats_years\` text DEFAULT '12+',
  	\`about_content_stats_customers\` text DEFAULT '50,000+',
  	\`about_content_stats_cabs\` text DEFAULT '45+',
  	\`about_content_stats_cities\` text DEFAULT '25+',
  	\`about_content_mission_title\` text,
  	\`about_content_mission_description\` text,
  	\`about_content_fleet_description\` text,
  	\`content_html\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`testimonials\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`location\` text,
  	\`rating\` numeric DEFAULT 5,
  	\`comment\` text NOT NULL,
  	\`tour_name\` text,
  	\`date\` text,
  	\`avatar_url\` text,
  	\`featured\` integer DEFAULT true,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`testimonials_updated_at_idx\` ON \`testimonials\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`testimonials_created_at_idx\` ON \`testimonials\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`faqs\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`question\` text NOT NULL,
  	\`answer\` text NOT NULL,
  	\`category\` text DEFAULT 'general',
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`faqs_updated_at_idx\` ON \`faqs\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`faqs_created_at_idx\` ON \`faqs\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`gallery\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`image_url\` text NOT NULL,
  	\`location\` text,
  	\`caption\` text,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`CREATE INDEX \`gallery_updated_at_idx\` ON \`gallery\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`gallery_created_at_idx\` ON \`gallery\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`redirects_rels\` ADD \`pages_id\` integer REFERENCES pages(id);`)
  await db.run(sql`CREATE INDEX \`redirects_rels_pages_id_idx\` ON \`redirects_rels\` (\`pages_id\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`pages_id\` integer REFERENCES pages(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`testimonials_id\` integer REFERENCES testimonials(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`faqs_id\` integer REFERENCES faqs(id);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`gallery_id\` integer REFERENCES gallery(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_pages_id_idx\` ON \`payload_locked_documents_rels\` (\`pages_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_testimonials_id_idx\` ON \`payload_locked_documents_rels\` (\`testimonials_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_faqs_id_idx\` ON \`payload_locked_documents_rels\` (\`faqs_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_gallery_id_idx\` ON \`payload_locked_documents_rels\` (\`gallery_id\`);`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`office_address\` text DEFAULT 'Shop No 4, Chembur West, Mumbai, Maharashtra 400071';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`working_hours\` text DEFAULT '24/7 Available (Open All 365 Days)';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`announcement_enabled\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`announcement_text\` text DEFAULT 'Available 24/7 for your convenience • 100% Sanitized Cabs with Expert Drivers';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`promo_popup_enabled\` integer DEFAULT true;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`promo_popup_delay_seconds\` numeric DEFAULT 5;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`promo_popup_headline\` text DEFAULT 'Special Tour Offer!';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`promo_popup_subtext\` text DEFAULT 'Get Flat 15% OFF on advance bookings for Mumbai Sightseeing and Outstation Tours.';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`promo_popup_discount_badge\` text DEFAULT 'FLAT 15% OFF';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`promo_popup_coupon_code\` text DEFAULT 'CITY15';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`footer_bio\` text DEFAULT 'City Tour Cabs is Mumbai''s trusted cab service. Clean sanitized cabs, experienced polite chauffeurs, and transparent flat pricing for Mumbai Darshan and outstation trips.';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`footer_copyright\` text DEFAULT '© 2026 City Tour Cabs. All rights reserved.';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`footer_facebook_url\` text DEFAULT 'https://facebook.com';`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`footer_instagram_url\` text DEFAULT 'https://instagram.com';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_slides\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`DROP TABLE \`testimonials\`;`)
  await db.run(sql`DROP TABLE \`faqs\`;`)
  await db.run(sql`DROP TABLE \`gallery\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_redirects_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`tours_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tours_id\`) REFERENCES \`tours\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_redirects_rels\`("id", "order", "parent_id", "path", "tours_id") SELECT "id", "order", "parent_id", "path", "tours_id" FROM \`redirects_rels\`;`)
  await db.run(sql`DROP TABLE \`redirects_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_redirects_rels\` RENAME TO \`redirects_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`redirects_rels_order_idx\` ON \`redirects_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`redirects_rels_parent_idx\` ON \`redirects_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`redirects_rels_path_idx\` ON \`redirects_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`redirects_rels_tours_id_idx\` ON \`redirects_rels\` (\`tours_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`tours_id\` integer,
  	\`fleet_id\` integer,
  	\`bookings_id\` text,
  	\`media_id\` integer,
  	\`users_id\` integer,
  	\`redirects_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`tours_id\`) REFERENCES \`tours\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`fleet_id\`) REFERENCES \`fleet\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`bookings_id\`) REFERENCES \`bookings\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`redirects_id\`) REFERENCES \`redirects\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "tours_id", "fleet_id", "bookings_id", "media_id", "users_id", "redirects_id") SELECT "id", "order", "parent_id", "path", "tours_id", "fleet_id", "bookings_id", "media_id", "users_id", "redirects_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_tours_id_idx\` ON \`payload_locked_documents_rels\` (\`tours_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_fleet_id_idx\` ON \`payload_locked_documents_rels\` (\`fleet_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_bookings_id_idx\` ON \`payload_locked_documents_rels\` (\`bookings_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_redirects_id_idx\` ON \`payload_locked_documents_rels\` (\`redirects_id\`);`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`office_address\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`working_hours\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`announcement_enabled\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`announcement_text\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`promo_popup_enabled\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`promo_popup_delay_seconds\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`promo_popup_headline\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`promo_popup_subtext\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`promo_popup_discount_badge\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`promo_popup_coupon_code\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`footer_bio\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`footer_copyright\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`footer_facebook_url\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`footer_instagram_url\`;`)
}
