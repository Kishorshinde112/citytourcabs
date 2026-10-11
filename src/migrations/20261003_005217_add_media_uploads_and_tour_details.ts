import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`tours_pricing_tiers\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`vehicle_name\` text NOT NULL,
  	\`category\` text DEFAULT 'Sedan',
  	\`capacity\` text DEFAULT '4 Passengers + 1 Driver',
  	\`rate\` text NOT NULL,
  	\`extra_km_rate\` text DEFAULT '₹13/km',
  	\`features\` text DEFAULT 'AC • Sanitized • Professional Chauffeur',
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tours\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tours_pricing_tiers_order_idx\` ON \`tours_pricing_tiers\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tours_pricing_tiers_parent_id_idx\` ON \`tours_pricing_tiers\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tours_sightseeing_points\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`timing\` text,
  	\`description\` text,
  	\`image_media_id\` integer,
  	\`image_url\` text,
  	FOREIGN KEY (\`image_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tours\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tours_sightseeing_points_order_idx\` ON \`tours_sightseeing_points\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tours_sightseeing_points_parent_id_idx\` ON \`tours_sightseeing_points\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`tours_sightseeing_points_image_media_idx\` ON \`tours_sightseeing_points\` (\`image_media_id\`);`)
  await db.run(sql`CREATE TABLE \`tours_itinerary\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`time_or_day\` text,
  	\`title\` text,
  	\`description\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tours\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tours_itinerary_order_idx\` ON \`tours_itinerary\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tours_itinerary_parent_id_idx\` ON \`tours_itinerary\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tours_exclusions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`item\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tours\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tours_exclusions_order_idx\` ON \`tours_exclusions\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tours_exclusions_parent_id_idx\` ON \`tours_exclusions\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`tours_tour_faqs\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`question\` text,
  	\`answer\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`tours\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`tours_tour_faqs_order_idx\` ON \`tours_tour_faqs\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`tours_tour_faqs_parent_id_idx\` ON \`tours_tour_faqs\` (\`_parent_id\`);`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_pages_slides\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_media_id\` integer,
  	\`image\` text,
  	\`subtitle\` text,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`button_text\` text,
  	\`link\` text,
  	FOREIGN KEY (\`image_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_pages_slides\`("_order", "_parent_id", "id", "image_media_id", "image", "subtitle", "title", "description", "button_text", "link") SELECT "_order", "_parent_id", "id", null, "image", "subtitle", "title", "description", "button_text", "link" FROM \`pages_slides\`;`)
  await db.run(sql`DROP TABLE \`pages_slides\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_slides\` RENAME TO \`pages_slides\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`pages_slides_order_idx\` ON \`pages_slides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_slides_parent_id_idx\` ON \`pages_slides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_slides_image_media_idx\` ON \`pages_slides\` (\`image_media_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_gallery\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`image_media_id\` integer,
  	\`image_url\` text,
  	\`location\` text,
  	\`caption\` text,
  	\`order\` numeric DEFAULT 0,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_gallery\`("id", "title", "image_media_id", "image_url", "location", "caption", "order", "updated_at", "created_at") SELECT "id", "title", null, "image_url", "location", "caption", "order", "updated_at", "created_at" FROM \`gallery\`;`)
  await db.run(sql`DROP TABLE \`gallery\`;`)
  await db.run(sql`ALTER TABLE \`__new_gallery\` RENAME TO \`gallery\`;`)
  await db.run(sql`CREATE INDEX \`gallery_image_media_idx\` ON \`gallery\` (\`image_media_id\`);`)
  await db.run(sql`CREATE INDEX \`gallery_updated_at_idx\` ON \`gallery\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`gallery_created_at_idx\` ON \`gallery\` (\`created_at\`);`)
  await db.run(sql`ALTER TABLE \`tours\` ADD \`hero_image_media_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`tours_hero_image_media_idx\` ON \`tours\` (\`hero_image_media_id\`);`)
  await db.run(sql`ALTER TABLE \`fleet\` ADD \`image_media_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`fleet_image_media_idx\` ON \`fleet\` (\`image_media_id\`);`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`hero_background_image_media_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`about_content_driver_image_media_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`pages_hero_hero_background_image_media_idx\` ON \`pages\` (\`hero_background_image_media_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_about_content_about_content_driver_image_media_idx\` ON \`pages\` (\`about_content_driver_image_media_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`tours_pricing_tiers\`;`)
  await db.run(sql`DROP TABLE \`tours_sightseeing_points\`;`)
  await db.run(sql`DROP TABLE \`tours_itinerary\`;`)
  await db.run(sql`DROP TABLE \`tours_exclusions\`;`)
  await db.run(sql`DROP TABLE \`tours_tour_faqs\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_tours\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`tagline\` text,
  	\`duration\` text,
  	\`starting_price\` text,
  	\`hero_image\` text,
  	\`description\` text,
  	\`popular\` integer DEFAULT false,
  	\`rate_table_html\` text,
  	\`itinerary_html\` text,
  	\`meta_title\` text,
  	\`meta_description\` text,
  	\`meta_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`meta_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_tours\`("id", "title", "slug", "tagline", "duration", "starting_price", "hero_image", "description", "popular", "rate_table_html", "itinerary_html", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "title", "slug", "tagline", "duration", "starting_price", "hero_image", "description", "popular", "rate_table_html", "itinerary_html", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`tours\`;`)
  await db.run(sql`DROP TABLE \`tours\`;`)
  await db.run(sql`ALTER TABLE \`__new_tours\` RENAME TO \`tours\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`tours_slug_idx\` ON \`tours\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`tours_meta_meta_image_idx\` ON \`tours\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`tours_updated_at_idx\` ON \`tours\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`tours_created_at_idx\` ON \`tours\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_fleet\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`name\` text NOT NULL,
  	\`category\` text DEFAULT 'Sedan' NOT NULL,
  	\`seating\` text DEFAULT '4 Passengers + 1 Driver',
  	\`luggage\` text DEFAULT '2 Large Bags + 2 Small Bags',
  	\`rate_per_km\` text DEFAULT '₹13/km',
  	\`image_url\` text DEFAULT '/assets/dzire-CAMjcjsT.jpg',
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
  await db.run(sql`INSERT INTO \`__new_fleet\`("id", "name", "category", "seating", "luggage", "rate_per_km", "image_url", "updated_at", "created_at") SELECT "id", "name", "category", "seating", "luggage", "rate_per_km", "image_url", "updated_at", "created_at" FROM \`fleet\`;`)
  await db.run(sql`DROP TABLE \`fleet\`;`)
  await db.run(sql`ALTER TABLE \`__new_fleet\` RENAME TO \`fleet\`;`)
  await db.run(sql`CREATE INDEX \`fleet_updated_at_idx\` ON \`fleet\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`fleet_created_at_idx\` ON \`fleet\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages_slides\` (
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
  await db.run(sql`INSERT INTO \`__new_pages_slides\`("_order", "_parent_id", "id", "image", "subtitle", "title", "description", "button_text", "link") SELECT "_order", "_parent_id", "id", "image", "subtitle", "title", "description", "button_text", "link" FROM \`pages_slides\`;`)
  await db.run(sql`DROP TABLE \`pages_slides\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages_slides\` RENAME TO \`pages_slides\`;`)
  await db.run(sql`CREATE INDEX \`pages_slides_order_idx\` ON \`pages_slides\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`pages_slides_parent_id_idx\` ON \`pages_slides\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`__new_pages\` (
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
  await db.run(sql`INSERT INTO \`__new_pages\`("id", "title", "slug", "hero_title", "hero_subtitle", "hero_background_image", "hero_badge", "about_content_welcome_title", "about_content_welcome_description", "about_content_driver_image", "about_content_stats_years", "about_content_stats_customers", "about_content_stats_cabs", "about_content_stats_cities", "about_content_mission_title", "about_content_mission_description", "about_content_fleet_description", "content_html", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at") SELECT "id", "title", "slug", "hero_title", "hero_subtitle", "hero_background_image", "hero_badge", "about_content_welcome_title", "about_content_welcome_description", "about_content_driver_image", "about_content_stats_years", "about_content_stats_customers", "about_content_stats_cabs", "about_content_stats_cities", "about_content_mission_title", "about_content_mission_description", "about_content_fleet_description", "content_html", "meta_title", "meta_description", "meta_image_id", "updated_at", "created_at" FROM \`pages\`;`)
  await db.run(sql`DROP TABLE \`pages\`;`)
  await db.run(sql`ALTER TABLE \`__new_pages\` RENAME TO \`pages\`;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_slug_idx\` ON \`pages\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`pages_meta_meta_image_idx\` ON \`pages\` (\`meta_image_id\`);`)
  await db.run(sql`CREATE INDEX \`pages_updated_at_idx\` ON \`pages\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`pages_created_at_idx\` ON \`pages\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`__new_gallery\` (
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
  await db.run(sql`INSERT INTO \`__new_gallery\`("id", "title", "image_url", "location", "caption", "order", "updated_at", "created_at") SELECT "id", "title", "image_url", "location", "caption", "order", "updated_at", "created_at" FROM \`gallery\`;`)
  await db.run(sql`DROP TABLE \`gallery\`;`)
  await db.run(sql`ALTER TABLE \`__new_gallery\` RENAME TO \`gallery\`;`)
  await db.run(sql`CREATE INDEX \`gallery_updated_at_idx\` ON \`gallery\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`gallery_created_at_idx\` ON \`gallery\` (\`created_at\`);`)
}
