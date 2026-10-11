CREATE TABLE `bookings` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text DEFAULT 'Inquiry',
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`whatsapp` text,
	`route` text NOT NULL,
	`vehicle` text DEFAULT 'Standard Cab / Sedan',
	`date` text NOT NULL,
	`pickup_address` text,
	`pickup_time` text,
	`passengers` text DEFAULT '4',
	`status` text DEFAULT 'Pending',
	`special_requirements` text,
	`referrer` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `bookings_phone_idx` ON `bookings` (`phone`);--> statement-breakpoint
CREATE INDEX `bookings_updated_at_idx` ON `bookings` (`updated_at`);--> statement-breakpoint
CREATE INDEX `bookings_created_at_idx` ON `bookings` (`created_at`);--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` integer PRIMARY KEY NOT NULL,
	`question` text NOT NULL,
	`answer` text NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `faqs_updated_at_idx` ON `faqs` (`updated_at`);--> statement-breakpoint
CREATE INDEX `faqs_created_at_idx` ON `faqs` (`created_at`);--> statement-breakpoint
CREATE TABLE `fleet` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text,
	`tag` text,
	`seats` text,
	`configuration` text,
	`boot_space` text,
	`luggage` text,
	`ac_type` text,
	`fuel_type` text,
	`rate_per_km` text,
	`local_full_day` text,
	`image_url` text,
	`image_id` integer,
	`best_for` text,
	`features` text,
	`seating` text,
	`ac` integer DEFAULT true,
	`base_rate` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `fleet_image_idx` ON `fleet` (`image_id`);--> statement-breakpoint
CREATE INDEX `fleet_updated_at_idx` ON `fleet` (`updated_at`);--> statement-breakpoint
CREATE INDEX `fleet_created_at_idx` ON `fleet` (`created_at`);--> statement-breakpoint
CREATE TABLE `footer` (
	`id` integer PRIMARY KEY NOT NULL,
	`copyright` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
--> statement-breakpoint
CREATE TABLE `footer_groups` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `footer`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `footer_groups_order_idx` ON `footer_groups` (`_order`);--> statement-breakpoint
CREATE INDEX `footer_groups_parent_id_idx` ON `footer_groups` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `footer_groups_links` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`url` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `footer_groups`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `footer_groups_links_order_idx` ON `footer_groups_links` (`_order`);--> statement-breakpoint
CREATE INDEX `footer_groups_links_parent_id_idx` ON `footer_groups_links` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `gallery` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`category` text,
	`image_url` text,
	`image_id` integer,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `gallery_image_idx` ON `gallery` (`image_id`);--> statement-breakpoint
CREATE INDEX `gallery_updated_at_idx` ON `gallery` (`updated_at`);--> statement-breakpoint
CREATE INDEX `gallery_created_at_idx` ON `gallery` (`created_at`);--> statement-breakpoint
CREATE TABLE `media` (
	`id` integer PRIMARY KEY NOT NULL,
	`alt` text NOT NULL,
	`caption` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`url` text,
	`thumbnail_u_r_l` text,
	`filename` text,
	`mime_type` text,
	`filesize` numeric,
	`width` numeric,
	`height` numeric,
	`focal_x` numeric,
	`focal_y` numeric,
	`sizes_thumbnail_url` text,
	`sizes_thumbnail_width` numeric,
	`sizes_thumbnail_height` numeric,
	`sizes_thumbnail_mime_type` text,
	`sizes_thumbnail_filesize` numeric,
	`sizes_thumbnail_filename` text,
	`sizes_card_url` text,
	`sizes_card_width` numeric,
	`sizes_card_height` numeric,
	`sizes_card_mime_type` text,
	`sizes_card_filesize` numeric,
	`sizes_card_filename` text,
	`sizes_hero_url` text,
	`sizes_hero_width` numeric,
	`sizes_hero_height` numeric,
	`sizes_hero_mime_type` text,
	`sizes_hero_filesize` numeric,
	`sizes_hero_filename` text
);
--> statement-breakpoint
CREATE INDEX `media_updated_at_idx` ON `media` (`updated_at`);--> statement-breakpoint
CREATE INDEX `media_created_at_idx` ON `media` (`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `media_filename_idx` ON `media` (`filename`);--> statement-breakpoint
CREATE INDEX `media_sizes_thumbnail_sizes_thumbnail_filename_idx` ON `media` (`sizes_thumbnail_filename`);--> statement-breakpoint
CREATE INDEX `media_sizes_card_sizes_card_filename_idx` ON `media` (`sizes_card_filename`);--> statement-breakpoint
CREATE INDEX `media_sizes_hero_sizes_hero_filename_idx` ON `media` (`sizes_hero_filename`);--> statement-breakpoint
CREATE TABLE `navigation` (
	`id` integer PRIMARY KEY NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
--> statement-breakpoint
CREATE TABLE `navigation_links` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`url` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `navigation`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `navigation_links_order_idx` ON `navigation_links` (`_order`);--> statement-breakpoint
CREATE INDEX `navigation_links_parent_id_idx` ON `navigation_links` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `pages` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`seo_canonical` text,
	`slug` text NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pages_slug_idx` ON `pages` (`slug`);--> statement-breakpoint
CREATE INDEX `pages_updated_at_idx` ON `pages` (`updated_at`);--> statement-breakpoint
CREATE INDEX `pages_created_at_idx` ON `pages` (`created_at`);--> statement-breakpoint
CREATE TABLE `pages_blocks_about` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`subtitle` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_about_order_idx` ON `pages_blocks_about` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_about_parent_id_idx` ON `pages_blocks_about` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_about_path_idx` ON `pages_blocks_about` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_booking_contact_form` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_booking_contact_form_order_idx` ON `pages_blocks_booking_contact_form` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_booking_contact_form_parent_id_idx` ON `pages_blocks_booking_contact_form` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_booking_contact_form_path_idx` ON `pages_blocks_booking_contact_form` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_booking_form` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_booking_form_order_idx` ON `pages_blocks_booking_form` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_booking_form_parent_id_idx` ON `pages_blocks_booking_form` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_booking_form_path_idx` ON `pages_blocks_booking_form` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_cta` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`headline` text,
	`button_text` text,
	`button_link` text,
	`style` text DEFAULT 'primary',
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_cta_order_idx` ON `pages_blocks_cta` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_cta_parent_id_idx` ON `pages_blocks_cta` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_cta_path_idx` ON `pages_blocks_cta` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_faq` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_faq_order_idx` ON `pages_blocks_faq` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_faq_parent_id_idx` ON `pages_blocks_faq` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_faq_path_idx` ON `pages_blocks_faq` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_fleet` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_fleet_order_idx` ON `pages_blocks_fleet` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_fleet_parent_id_idx` ON `pages_blocks_fleet` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_fleet_path_idx` ON `pages_blocks_fleet` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_gallery` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_gallery_order_idx` ON `pages_blocks_gallery` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_gallery_parent_id_idx` ON `pages_blocks_gallery` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_gallery_path_idx` ON `pages_blocks_gallery` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_hero` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`image_id` integer,
	`block_name` text,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_hero_order_idx` ON `pages_blocks_hero` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_hero_parent_id_idx` ON `pages_blocks_hero` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_hero_path_idx` ON `pages_blocks_hero` (`_path`);--> statement-breakpoint
CREATE INDEX `pages_blocks_hero_image_idx` ON `pages_blocks_hero` (`image_id`);--> statement-breakpoint
CREATE TABLE `pages_blocks_rate_table` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_rate_table_order_idx` ON `pages_blocks_rate_table` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_rate_table_parent_id_idx` ON `pages_blocks_rate_table` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_rate_table_path_idx` ON `pages_blocks_rate_table` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_rate_table_rates` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`car_type` text NOT NULL,
	`seating` text,
	`ac` integer DEFAULT true,
	`rate` text NOT NULL,
	`per_km` text,
	`toll_parking` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages_blocks_rate_table`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_rate_table_rates_order_idx` ON `pages_blocks_rate_table_rates` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_rate_table_rates_parent_id_idx` ON `pages_blocks_rate_table_rates` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `pages_blocks_rich_text` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`content` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_rich_text_order_idx` ON `pages_blocks_rich_text` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_rich_text_parent_id_idx` ON `pages_blocks_rich_text` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_rich_text_path_idx` ON `pages_blocks_rich_text` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_testimonials` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_testimonials_order_idx` ON `pages_blocks_testimonials` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_testimonials_parent_id_idx` ON `pages_blocks_testimonials` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_testimonials_path_idx` ON `pages_blocks_testimonials` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_tour_details` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`tour_name` text,
	`subtitle` text,
	`hero_image` text,
	`description` text,
	`trip_type` text,
	`attraction_title` text,
	`tempo_traveller13_rate` text,
	`tempo_traveller17_rate` text,
	`coverage_details` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_tour_details_order_idx` ON `pages_blocks_tour_details` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_tour_details_parent_id_idx` ON `pages_blocks_tour_details` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_tour_details_path_idx` ON `pages_blocks_tour_details` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_tour_details_attractions` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`emoji` text,
	`name` text NOT NULL,
	`desc` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages_blocks_tour_details`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_tour_details_attractions_order_idx` ON `pages_blocks_tour_details_attractions` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_tour_details_attractions_parent_id_idx` ON `pages_blocks_tour_details_attractions` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `pages_blocks_tour_details_rate_columns` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`col_name` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages_blocks_tour_details`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_tour_details_rate_columns_order_idx` ON `pages_blocks_tour_details_rate_columns` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_tour_details_rate_columns_parent_id_idx` ON `pages_blocks_tour_details_rate_columns` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `pages_blocks_tour_details_rates` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`vehicle` text NOT NULL,
	`h8` text,
	`h10` text,
	`h12` text,
	`extra` text,
	`col1` text,
	`col2` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages_blocks_tour_details`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_tour_details_rates_order_idx` ON `pages_blocks_tour_details_rates` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_tour_details_rates_parent_id_idx` ON `pages_blocks_tour_details_rates` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `pages_blocks_tour_details_rules` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages_blocks_tour_details`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_tour_details_rules_order_idx` ON `pages_blocks_tour_details_rules` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_tour_details_rules_parent_id_idx` ON `pages_blocks_tour_details_rules` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `pages_blocks_tour_grid` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_tour_grid_order_idx` ON `pages_blocks_tour_grid` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_tour_grid_parent_id_idx` ON `pages_blocks_tour_grid` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_tour_grid_path_idx` ON `pages_blocks_tour_grid` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_blocks_why_choose_us` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`subtitle` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_blocks_why_choose_us_order_idx` ON `pages_blocks_why_choose_us` (`_order`);--> statement-breakpoint
CREATE INDEX `pages_blocks_why_choose_us_parent_id_idx` ON `pages_blocks_why_choose_us` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `pages_blocks_why_choose_us_path_idx` ON `pages_blocks_why_choose_us` (`_path`);--> statement-breakpoint
CREATE TABLE `pages_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`tours_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tours_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `pages_rels_order_idx` ON `pages_rels` (`order`);--> statement-breakpoint
CREATE INDEX `pages_rels_parent_idx` ON `pages_rels` (`parent_id`);--> statement-breakpoint
CREATE INDEX `pages_rels_path_idx` ON `pages_rels` (`path`);--> statement-breakpoint
CREATE INDEX `pages_rels_tours_id_idx` ON `pages_rels` (`tours_id`);--> statement-breakpoint
CREATE TABLE `payload_kv` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text NOT NULL,
	`data` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payload_kv_key_idx` ON `payload_kv` (`key`);--> statement-breakpoint
CREATE TABLE `payload_locked_documents` (
	`id` integer PRIMARY KEY NOT NULL,
	`global_slug` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `payload_locked_documents_global_slug_idx` ON `payload_locked_documents` (`global_slug`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_updated_at_idx` ON `payload_locked_documents` (`updated_at`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_created_at_idx` ON `payload_locked_documents` (`created_at`);--> statement-breakpoint
CREATE TABLE `payload_locked_documents_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	`media_id` integer,
	`tours_id` integer,
	`pages_id` integer,
	`bookings_id` text,
	`fleet_id` integer,
	`gallery_id` integer,
	`testimonials_id` integer,
	`faqs_id` integer,
	`redirects_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `payload_locked_documents`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`media_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tours_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`pages_id`) REFERENCES `pages`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`bookings_id`) REFERENCES `bookings`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`fleet_id`) REFERENCES `fleet`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`gallery_id`) REFERENCES `gallery`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`testimonials_id`) REFERENCES `testimonials`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`faqs_id`) REFERENCES `faqs`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`redirects_id`) REFERENCES `redirects`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_order_idx` ON `payload_locked_documents_rels` (`order`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_parent_idx` ON `payload_locked_documents_rels` (`parent_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_path_idx` ON `payload_locked_documents_rels` (`path`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_users_id_idx` ON `payload_locked_documents_rels` (`users_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_media_id_idx` ON `payload_locked_documents_rels` (`media_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_tours_id_idx` ON `payload_locked_documents_rels` (`tours_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_pages_id_idx` ON `payload_locked_documents_rels` (`pages_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_bookings_id_idx` ON `payload_locked_documents_rels` (`bookings_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_fleet_id_idx` ON `payload_locked_documents_rels` (`fleet_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_gallery_id_idx` ON `payload_locked_documents_rels` (`gallery_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_testimonials_id_idx` ON `payload_locked_documents_rels` (`testimonials_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_faqs_id_idx` ON `payload_locked_documents_rels` (`faqs_id`);--> statement-breakpoint
CREATE INDEX `payload_locked_documents_rels_redirects_id_idx` ON `payload_locked_documents_rels` (`redirects_id`);--> statement-breakpoint
CREATE TABLE `payload_migrations` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text,
	`batch` numeric,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `payload_migrations_updated_at_idx` ON `payload_migrations` (`updated_at`);--> statement-breakpoint
CREATE INDEX `payload_migrations_created_at_idx` ON `payload_migrations` (`created_at`);--> statement-breakpoint
CREATE TABLE `payload_preferences` (
	`id` integer PRIMARY KEY NOT NULL,
	`key` text,
	`value` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `payload_preferences_key_idx` ON `payload_preferences` (`key`);--> statement-breakpoint
CREATE INDEX `payload_preferences_updated_at_idx` ON `payload_preferences` (`updated_at`);--> statement-breakpoint
CREATE INDEX `payload_preferences_created_at_idx` ON `payload_preferences` (`created_at`);--> statement-breakpoint
CREATE TABLE `payload_preferences_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`users_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `payload_preferences`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`users_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `payload_preferences_rels_order_idx` ON `payload_preferences_rels` (`order`);--> statement-breakpoint
CREATE INDEX `payload_preferences_rels_parent_idx` ON `payload_preferences_rels` (`parent_id`);--> statement-breakpoint
CREATE INDEX `payload_preferences_rels_path_idx` ON `payload_preferences_rels` (`path`);--> statement-breakpoint
CREATE INDEX `payload_preferences_rels_users_id_idx` ON `payload_preferences_rels` (`users_id`);--> statement-breakpoint
CREATE TABLE `redirects` (
	`id` integer PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`destination` text NOT NULL,
	`permanent` integer DEFAULT true,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `redirects_updated_at_idx` ON `redirects` (`updated_at`);--> statement-breakpoint
CREATE INDEX `redirects_created_at_idx` ON `redirects` (`created_at`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY NOT NULL,
	`business_name` text,
	`phone` text,
	`help_phone` text,
	`email` text,
	`whatsapp` text,
	`chatbot_webhook_url` text,
	`logo_id` integer,
	`site_name` text,
	`support_phone` text,
	`support_email` text,
	`whatsapp_number` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	FOREIGN KEY (`logo_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX `site_settings_logo_idx` ON `site_settings` (`logo_id`);--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`rating` text DEFAULT '5',
	`trip` text,
	`location` text,
	`date` text,
	`avatar` text,
	`text` text NOT NULL,
	`comment` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `testimonials_updated_at_idx` ON `testimonials` (`updated_at`);--> statement-breakpoint
CREATE INDEX `testimonials_created_at_idx` ON `testimonials` (`created_at`);--> statement-breakpoint
CREATE TABLE `tours` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`seo_canonical` text,
	`slug` text NOT NULL,
	`display_order` numeric DEFAULT 100 NOT NULL,
	`starting_price` text,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tours_slug_idx` ON `tours` (`slug`);--> statement-breakpoint
CREATE INDEX `tours_updated_at_idx` ON `tours` (`updated_at`);--> statement-breakpoint
CREATE INDEX `tours_created_at_idx` ON `tours` (`created_at`);--> statement-breakpoint
CREATE TABLE `tours_blocks_about` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`subtitle` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_about_order_idx` ON `tours_blocks_about` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_about_parent_id_idx` ON `tours_blocks_about` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `tours_blocks_about_path_idx` ON `tours_blocks_about` (`_path`);--> statement-breakpoint
CREATE TABLE `tours_blocks_booking_contact_form` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_booking_contact_form_order_idx` ON `tours_blocks_booking_contact_form` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_booking_contact_form_parent_id_idx` ON `tours_blocks_booking_contact_form` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `tours_blocks_booking_contact_form_path_idx` ON `tours_blocks_booking_contact_form` (`_path`);--> statement-breakpoint
CREATE TABLE `tours_blocks_booking_form` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_booking_form_order_idx` ON `tours_blocks_booking_form` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_booking_form_parent_id_idx` ON `tours_blocks_booking_form` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `tours_blocks_booking_form_path_idx` ON `tours_blocks_booking_form` (`_path`);--> statement-breakpoint
CREATE TABLE `tours_blocks_cta` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`headline` text,
	`button_text` text,
	`button_link` text,
	`style` text DEFAULT 'primary',
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_cta_order_idx` ON `tours_blocks_cta` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_cta_parent_id_idx` ON `tours_blocks_cta` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `tours_blocks_cta_path_idx` ON `tours_blocks_cta` (`_path`);--> statement-breakpoint
CREATE TABLE `tours_blocks_faq` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_faq_order_idx` ON `tours_blocks_faq` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_faq_parent_id_idx` ON `tours_blocks_faq` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `tours_blocks_faq_path_idx` ON `tours_blocks_faq` (`_path`);--> statement-breakpoint
CREATE TABLE `tours_blocks_fleet` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_fleet_order_idx` ON `tours_blocks_fleet` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_fleet_parent_id_idx` ON `tours_blocks_fleet` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `tours_blocks_fleet_path_idx` ON `tours_blocks_fleet` (`_path`);--> statement-breakpoint
CREATE TABLE `tours_blocks_gallery` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_gallery_order_idx` ON `tours_blocks_gallery` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_gallery_parent_id_idx` ON `tours_blocks_gallery` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `tours_blocks_gallery_path_idx` ON `tours_blocks_gallery` (`_path`);--> statement-breakpoint
CREATE TABLE `tours_blocks_hero` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`subtitle` text,
	`image_id` integer,
	`block_name` text,
	FOREIGN KEY (`image_id`) REFERENCES `media`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_hero_order_idx` ON `tours_blocks_hero` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_hero_parent_id_idx` ON `tours_blocks_hero` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `tours_blocks_hero_path_idx` ON `tours_blocks_hero` (`_path`);--> statement-breakpoint
CREATE INDEX `tours_blocks_hero_image_idx` ON `tours_blocks_hero` (`image_id`);--> statement-breakpoint
CREATE TABLE `tours_blocks_rate_table` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_rate_table_order_idx` ON `tours_blocks_rate_table` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_rate_table_parent_id_idx` ON `tours_blocks_rate_table` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `tours_blocks_rate_table_path_idx` ON `tours_blocks_rate_table` (`_path`);--> statement-breakpoint
CREATE TABLE `tours_blocks_rate_table_rates` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`car_type` text NOT NULL,
	`seating` text,
	`ac` integer DEFAULT true,
	`rate` text NOT NULL,
	`per_km` text,
	`toll_parking` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours_blocks_rate_table`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_rate_table_rates_order_idx` ON `tours_blocks_rate_table_rates` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_rate_table_rates_parent_id_idx` ON `tours_blocks_rate_table_rates` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `tours_blocks_rich_text` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`content` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_rich_text_order_idx` ON `tours_blocks_rich_text` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_rich_text_parent_id_idx` ON `tours_blocks_rich_text` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `tours_blocks_rich_text_path_idx` ON `tours_blocks_rich_text` (`_path`);--> statement-breakpoint
CREATE TABLE `tours_blocks_testimonials` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_testimonials_order_idx` ON `tours_blocks_testimonials` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_testimonials_parent_id_idx` ON `tours_blocks_testimonials` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `tours_blocks_testimonials_path_idx` ON `tours_blocks_testimonials` (`_path`);--> statement-breakpoint
CREATE TABLE `tours_blocks_tour_details` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`tour_name` text,
	`subtitle` text,
	`hero_image` text,
	`description` text,
	`trip_type` text,
	`attraction_title` text,
	`tempo_traveller13_rate` text,
	`tempo_traveller17_rate` text,
	`coverage_details` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_tour_details_order_idx` ON `tours_blocks_tour_details` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_tour_details_parent_id_idx` ON `tours_blocks_tour_details` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `tours_blocks_tour_details_path_idx` ON `tours_blocks_tour_details` (`_path`);--> statement-breakpoint
CREATE TABLE `tours_blocks_tour_details_attractions` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`emoji` text,
	`name` text NOT NULL,
	`desc` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours_blocks_tour_details`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_tour_details_attractions_order_idx` ON `tours_blocks_tour_details_attractions` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_tour_details_attractions_parent_id_idx` ON `tours_blocks_tour_details_attractions` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `tours_blocks_tour_details_rate_columns` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`col_name` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours_blocks_tour_details`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_tour_details_rate_columns_order_idx` ON `tours_blocks_tour_details_rate_columns` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_tour_details_rate_columns_parent_id_idx` ON `tours_blocks_tour_details_rate_columns` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `tours_blocks_tour_details_rates` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`vehicle` text NOT NULL,
	`h8` text,
	`h10` text,
	`h12` text,
	`extra` text,
	`col1` text,
	`col2` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours_blocks_tour_details`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_tour_details_rates_order_idx` ON `tours_blocks_tour_details_rates` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_tour_details_rates_parent_id_idx` ON `tours_blocks_tour_details_rates` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `tours_blocks_tour_details_rules` (
	`_order` integer NOT NULL,
	`_parent_id` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`text` text NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours_blocks_tour_details`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_tour_details_rules_order_idx` ON `tours_blocks_tour_details_rules` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_tour_details_rules_parent_id_idx` ON `tours_blocks_tour_details_rules` (`_parent_id`);--> statement-breakpoint
CREATE TABLE `tours_blocks_tour_grid` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_tour_grid_order_idx` ON `tours_blocks_tour_grid` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_tour_grid_parent_id_idx` ON `tours_blocks_tour_grid` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `tours_blocks_tour_grid_path_idx` ON `tours_blocks_tour_grid` (`_path`);--> statement-breakpoint
CREATE TABLE `tours_blocks_why_choose_us` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`_path` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`title` text,
	`subtitle` text,
	`block_name` text,
	FOREIGN KEY (`_parent_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_blocks_why_choose_us_order_idx` ON `tours_blocks_why_choose_us` (`_order`);--> statement-breakpoint
CREATE INDEX `tours_blocks_why_choose_us_parent_id_idx` ON `tours_blocks_why_choose_us` (`_parent_id`);--> statement-breakpoint
CREATE INDEX `tours_blocks_why_choose_us_path_idx` ON `tours_blocks_why_choose_us` (`_path`);--> statement-breakpoint
CREATE TABLE `tours_rels` (
	`id` integer PRIMARY KEY NOT NULL,
	`order` integer,
	`parent_id` integer NOT NULL,
	`path` text NOT NULL,
	`tours_id` integer,
	FOREIGN KEY (`parent_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tours_id`) REFERENCES `tours`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `tours_rels_order_idx` ON `tours_rels` (`order`);--> statement-breakpoint
CREATE INDEX `tours_rels_parent_idx` ON `tours_rels` (`parent_id`);--> statement-breakpoint
CREATE INDEX `tours_rels_path_idx` ON `tours_rels` (`path`);--> statement-breakpoint
CREATE INDEX `tours_rels_tours_id_idx` ON `tours_rels` (`tours_id`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'admin' NOT NULL,
	`updated_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	`email` text NOT NULL,
	`reset_password_token` text,
	`reset_password_expiration` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	`salt` text,
	`hash` text,
	`reset_password_requested_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	`login_attempts` numeric DEFAULT 0,
	`lock_until` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
--> statement-breakpoint
CREATE INDEX `users_updated_at_idx` ON `users` (`updated_at`);--> statement-breakpoint
CREATE INDEX `users_created_at_idx` ON `users` (`created_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_idx` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `users_sessions` (
	`_order` integer NOT NULL,
	`_parent_id` integer NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`created_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
	`expires_at` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
	FOREIGN KEY (`_parent_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `users_sessions_order_idx` ON `users_sessions` (`_order`);--> statement-breakpoint
CREATE INDEX `users_sessions_parent_id_idx` ON `users_sessions` (`_parent_id`);