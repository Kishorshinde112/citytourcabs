import sqlite3
import json
import datetime

SRC_DB = '/home/ubuntu/cabs-citytour/data/payload.db'
DST_DB = '/home/ubuntu/citytourcabs/data/citytourcabs.db'

def run_sync():
    print(f"Connecting to {SRC_DB} and {DST_DB}...")
    src = sqlite3.connect(SRC_DB)
    dst = sqlite3.connect(DST_DB)
    src_cur = src.cursor()
    dst_cur = dst.cursor()

    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()

    # 1. Sync Tours & Tour Blocks
    tour_tables = [
        'tours',
        'tours_blocks_tour_details',
        'tours_blocks_tour_details_attractions',
        'tours_blocks_tour_details_rate_columns',
        'tours_blocks_tour_details_rates',
        'tours_blocks_tour_details_rules',
    ]

    for table in tour_tables:
        print(f"Syncing {table}...")
        dst_cur.execute(f"DELETE FROM \"{table}\"")
        src_cur.execute(f"SELECT * FROM \"{table}\"")
        rows = src_cur.fetchall()
        cols = [c[1] for c in src_cur.execute(f"PRAGMA table_info(\"{table}\")").fetchall()]
        placeholders = ", ".join(["?"] * len(cols))
        col_names = ", ".join([f'"{c}"' for c in cols])
        dst_cur.executemany(f"INSERT INTO \"{table}\" ({col_names}) VALUES ({placeholders})", rows)
        print(f"  -> Inserted {len(rows)} rows into {table}")

    # 2. Sync Pages & Page Blocks
    page_tables = [
        'pages',
        'pages_blocks_hero',
        'pages_blocks_tour_grid',
        'pages_blocks_fleet',
        'pages_blocks_gallery',
        'pages_blocks_testimonials',
        'pages_blocks_faq',
        'pages_blocks_why_choose_us',
        'pages_blocks_about',
        'pages_blocks_booking_contact_form',
    ]

    for table in page_tables:
        print(f"Syncing {table}...")
        dst_cur.execute(f"DELETE FROM \"{table}\"")
        src_cur.execute(f"SELECT * FROM \"{table}\"")
        rows = src_cur.fetchall()
        cols = [c[1] for c in src_cur.execute(f"PRAGMA table_info(\"{table}\")").fetchall()]
        placeholders = ", ".join(["?"] * len(cols))
        col_names = ", ".join([f'"{c}"' for c in cols])
        dst_cur.executemany(f"INSERT INTO \"{table}\" ({col_names}) VALUES ({placeholders})", rows)
        print(f"  -> Inserted {len(rows)} rows into {table}")

    # 2b. Add About Us & Privacy Policy pages if not already present
    dst_cur.execute("SELECT id FROM pages WHERE slug = 'about'")
    if not dst_cur.fetchone():
        dst_cur.execute(
            "INSERT INTO pages (id, title, seo_title, seo_description, seo_canonical, slug, updated_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (2, "About Us", "About Us | City Tour Cabs Mumbai", "Your trusted local cab partner in Mumbai with 12+ years of experience.", "https://citytourcabs.in/about", "about", now_iso, now_iso)
        )
        # Add about block for page 2
        dst_cur.execute(
            "INSERT INTO pages_blocks_about (_order, _parent_id, _path, id) VALUES (?, ?, ?, ?)",
            (1, 2, "layout", "about-block-page-2")
        )
        print("  -> Added About Us page (id=2)")

    dst_cur.execute("SELECT id FROM pages WHERE slug = 'privacy-policy'")
    if not dst_cur.fetchone():
        dst_cur.execute(
            "INSERT INTO pages (id, title, seo_title, seo_description, seo_canonical, slug, updated_at, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (3, "Privacy Policy & Terms", "Privacy Policy & Terms | City Tour Cabs Mumbai", "Transparent policies designed for passenger safety and peace of mind.", "https://citytourcabs.in/privacy-policy", "privacy-policy", now_iso, now_iso)
        )
        print("  -> Added Privacy Policy page (id=3)")

    # 3. Sync Site Settings
    dst_cur.execute("DELETE FROM site_settings")
    dst_cur.execute("""
        INSERT INTO site_settings (
            id, business_name, phone, help_phone, email, whatsapp, 
            chatbot_webhook_url, site_name, support_phone, support_email, 
            whatsapp_number, updated_at, created_at
        ) VALUES (
            1, 'City Tour Cabs', '7021001921', '9967672660', 'citytourcabs8@gmail.com', '917021001921',
            'https://n8n.kishorlab.dev/webhook-test/4d6e3906-3c0c-4c18-bef2-cf30563485c0', 'City Tour Cabs', '7021001921', 'citytourcabs8@gmail.com',
            '917021001921', ?, ?
        )
    """, (now_iso, now_iso))
    print("  -> Seeded site_settings")

    # 4. Clean up any foreign branding references
    dst_cur.execute("UPDATE tours_blocks_tour_details_rules SET text = REPLACE(text, 'City Cabs 24', 'City Tour Cabs')")
    dst_cur.execute("UPDATE tours_blocks_tour_details_rules SET text = REPLACE(text, 'CityCabs24', 'City Tour Cabs')")
    dst_cur.execute("UPDATE pages_blocks_about SET title = 'About City Tour Cabs' WHERE title LIKE '%CityCabs24%'")
    dst_cur.execute("UPDATE pages_blocks_why_choose_us SET title = 'Why Choose City Tour Cabs?' WHERE title LIKE '%CityCabs24%'")
    dst_cur.execute("UPDATE pages SET seo_title = REPLACE(seo_title, 'CityCabs24', 'City Tour Cabs')")
    dst_cur.execute("UPDATE pages SET seo_canonical = REPLACE(seo_canonical, 'citycabs24.com', 'citytourcabs.in')")
    dst_cur.execute("UPDATE tours SET seo_description = REPLACE(seo_description, 'CityCabs24', 'City Tour Cabs')")
    dst_cur.execute("UPDATE tours SET seo_canonical = REPLACE(seo_canonical, 'citycabs24.com', 'citytourcabs.in')")
    print("  -> Cleaned all branding to City Tour Cabs")

    # 5. Populate Fleet Vehicles
    fleet_items = [
        {
            "id": 1,
            "name": "Maruti Wagon R",
            "category": "Hatchback",
            "tag": "Budget Friendly",
            "seats": "4 + 1 Passengers",
            "configuration": "2 front seats, 3 rear seats",
            "boot_space": "341 Liters",
            "luggage": "2 Medium Bags + Handbags",
            "ac_type": "Chilled AC",
            "fuel_type": "CNG / Petrol",
            "rate_per_km": "₹11 / km",
            "local_full_day": "₹2,199 / 8hr 80km",
            "image_url": "/assets/wagonr-Ct1Y7D7H.jpg",
            "best_for": "Couple trips, solo travellers, daily city commute & budget getaways",
            "features": "Clean & Sanitized Interiors\nTall Boy Design with High Headroom\nBluetooth & Music System\nEconomical City & Short Outstation"
        },
        {
            "id": 2,
            "name": "Swift Dzire / Accent",
            "category": "Prime Sedan",
            "tag": "Most Popular",
            "seats": "4 + 1 Passengers",
            "configuration": "2 front seats, 3 comfortable rear seats",
            "boot_space": "382 Liters",
            "luggage": "3-4 Medium Size Bags",
            "ac_type": "Climate Controlled AC",
            "fuel_type": "CNG / Petrol",
            "rate_per_km": "₹12 / km",
            "local_full_day": "₹2,499 / 8hr 80km",
            "image_url": "/assets/dzire-CAMjcjsT.jpg",
            "best_for": "Small families, airport transfers, Mumbai Darshan & outstation trips",
            "features": "Smooth Highway Suspension\nSpacious Legroom & Reclining Seats\nLarge Dedicated Trunk for Luggage\nMobile Charging Port Available"
        },
        {
            "id": 3,
            "name": "Maruti Suzuki Ertiga",
            "category": "Family MUV",
            "tag": "Best for Family",
            "seats": "6 + 1 Passengers",
            "configuration": "2 Front + 3 Middle + 2 Third Row",
            "boot_space": "209 - 550 Liters (Foldable)",
            "luggage": "3-4 Medium Bags + Roof Carrier Available",
            "ac_type": "Dual Zone AC (Roof Vents for Rear)",
            "fuel_type": "CNG / Petrol",
            "rate_per_km": "₹15 / km",
            "local_full_day": "₹3,499 / 8hr 80km",
            "image_url": "/assets/ertiga-Cg99jW66.jpg",
            "best_for": "Medium families, pilgrimage tours (Shirdi/Ashtavinayak), group sightseeing",
            "features": "Roof AC Vents for 2nd & 3rd Row\nFoldable Third Row for Extra Luggage\nReclining Middle Captain-style Seats\nHigh Ground Clearance for Ghat Roads"
        },
        {
            "id": 4,
            "name": "Kia Carens",
            "category": "Premium MPV",
            "tag": "Luxury Comfort",
            "seats": "6 + 1 / 7 Seater",
            "configuration": "Ergonomic 3-row Seating with Easy Walk-in",
            "boot_space": "216 Liters Expandable",
            "luggage": "3-5 Medium Bags",
            "ac_type": "Automatic Climate Control with Roof Vents",
            "fuel_type": "Diesel / Petrol",
            "rate_per_km": "₹17 / km",
            "local_full_day": "₹3,999 / 8hr 80km",
            "image_url": "/assets/kia-carens-B6Q9p_r1.jpg",
            "best_for": "Corporate travel, VIP city tours, high-comfort outstation & long weekend getaways",
            "features": "One-Touch Electric Tumble 2nd Row\nVentilated Plush Leatherette Seats\nUltra Quiet Cabin Insulation\nIndividual Charging Ports all 3 Rows"
        },
        {
            "id": 5,
            "name": "Toyota Innova Crysta",
            "category": "Luxury King",
            "tag": "King of Outstation",
            "seats": "7 + 1 Passengers",
            "configuration": "Captain Seats (2nd row) + Spacious 3rd row",
            "boot_space": "300 - 750 Liters",
            "luggage": "5-6 Large Bags + Roof Carrier",
            "ac_type": "Triple Zone Chilled Digital AC",
            "fuel_type": "Diesel Turbo",
            "rate_per_km": "₹19 / km",
            "local_full_day": "₹4,499 / 8hr 80km",
            "image_url": "/assets/innova-crysta-Cq-JzM2h.jpg",
            "best_for": "Long distance highway travel, VIP tourists, multi-day Konkan & Jyotirlinga circuits",
            "features": "Legendary Toyota Highway Ride & Safety\nRear Armrests & Ambient Interior Lighting\nMassive Legroom in all 3 Rows\nHeavy-Duty Suspension for Rough Ghats"
        },
        {
            "id": 6,
            "name": "Tempo Traveller (13/17/26)",
            "category": "Group Minibus",
            "tag": "Large Groups",
            "seats": "13 / 17 / 26 Seater",
            "configuration": "1x1 or 2x1 Recliner Seats + Wide Aisle",
            "boot_space": "Dedicated Rear Cargo Compartment",
            "luggage": "10-15 Heavy Suitcases",
            "ac_type": "Powerful High-Capacity Central AC",
            "fuel_type": "Diesel",
            "rate_per_km": "₹24 - ₹32 / km",
            "local_full_day": "₹6,999 / 8hr 80km",
            "image_url": "/assets/tempo-traveller-CY3qXf8s.jpg",
            "best_for": "Wedding guest transfers, corporate team outings, Ashtavinayak group yatras",
            "features": "Pushback Plush Recliner Seats\nLED TV & High-Output Music System\nIndividual AC Louvers & Reading Lights\nGenerous Standing Height & Wide Luggage Space"
        }
    ]

    dst_cur.execute("DELETE FROM fleet")
    for f in fleet_items:
        dst_cur.execute("""
            INSERT INTO fleet (
                id, name, category, tag, seats, configuration, boot_space, luggage, 
                ac_type, fuel_type, rate_per_km, local_full_day, image_url, best_for, 
                features, updated_at, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            f["id"], f["name"], f["category"], f["tag"], f["seats"], f["configuration"],
            f["boot_space"], f["luggage"], f["ac_type"], f["fuel_type"], f["rate_per_km"],
            f["local_full_day"], f["image_url"], f["best_for"], f["features"], now_iso, now_iso
        ))
    print(f"  -> Seeded {len(fleet_items)} fleet vehicles")

    # 6. Populate Testimonials
    testimonials_items = [
        {
            "id": 1,
            "name": "Rajesh Sharma",
            "rating": 5,
            "trip": "Mumbai Darshan (Full Day)",
            "location": "Borivali, Mumbai",
            "date": "September 2026",
            "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=150&h=150&q=80",
            "text": "Took my elderly parents for Mumbai Darshan in an Ertiga. Driver Ramesh was extraordinarily polite, guided us through Gateway and Siddhivinayak without any rushing. The car was spotless clean!"
        },
        {
            "id": 2,
            "name": "Priya Patel",
            "rating": 5,
            "trip": "Lonavala & Khandala Weekend",
            "location": "Thane West",
            "date": "August 2026",
            "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?fit=crop&w=150&h=150&q=80",
            "text": "Booked Swift Dzire for a 2-day family trip to Lonavala. Best rate quoted compared to Ola/Uber outstation, driver knew scenic viewpoints that avoided crowded toll points. Highly recommended!"
        },
        {
            "id": 3,
            "name": "Amit Desai",
            "rating": 5,
            "trip": "Shirdi & Shani Shingnapur",
            "location": "Dadar, Mumbai",
            "date": "August 2026",
            "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?fit=crop&w=150&h=150&q=80",
            "text": "Samruddhi Mahamarg journey to Shirdi was silky smooth in Innova Crysta. Punctual 4 AM doorstep pickup. Transparent billing with toll receipts. Will definitely book again for Jyotirlinga."
        },
        {
            "id": 4,
            "name": "Dr. Ananya Mukherjee",
            "rating": 5,
            "trip": "Mahabaleshwar & Panchgani 3D/2N",
            "location": "Andheri East, Mumbai",
            "date": "July 2026",
            "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?fit=crop&w=150&h=150&q=80",
            "text": "Travelled with kids to Mahabaleshwar. Driver was exceptionally patient on ghat curves and waited without complaints during strawberry farm visits. Honest pricing and sanitized vehicle."
        },
        {
            "id": 5,
            "name": "Suresh Gokhale",
            "rating": 5,
            "trip": "Ashtavinayak 3 Days Yatra",
            "location": "Chembur, Mumbai",
            "date": "July 2026",
            "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=150&h=150&q=80",
            "text": "Organized 17-seater Tempo Traveller for our family Ashtavinayak Yatra. Clean pushback seats, working AC throughout, very devoted and disciplined driver. 5-star experience for senior citizens."
        }
    ]

    dst_cur.execute("DELETE FROM testimonials")
    for t in testimonials_items:
        dst_cur.execute("""
            INSERT INTO testimonials (
                id, name, rating, trip, location, date, avatar, text, comment, updated_at, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            t["id"], t["name"], t["rating"], t["trip"], t["location"], t["date"],
            t["avatar"], t["text"], t["text"], now_iso, now_iso
        ))
    print(f"  -> Seeded {len(testimonials_items)} testimonials")

    # 7. Populate FAQs
    faq_items = [
        {
            "id": 1,
            "question": "How do your drivers act as tour guides?",
            "answer": "All our drivers are born and raised in Mumbai or Maharashtra. They know local history, prime photography viewpoints, monument opening hours, and authentic local food joints. While driving, they share interesting background stories and guide you through entry gates without needing an expensive third-party guide."
        },
        {
            "id": 2,
            "question": "Are Tolls, Parking, and Driver Allowance included in the fare?",
            "answer": "Our package rates include the vehicle hire, fuel, and experienced chauffeur charges. Toll taxes, monument parking fees, and entry tickets are paid directly as per actual receipts. For outstation multi-day trips, night driver allowance (₹300 - ₹500/night) is applicable if driving past 10 PM."
        },
        {
            "id": 3,
            "question": "Can I customize the tour itinerary or add/skip spots?",
            "answer": "Yes, 100%! All our sightseeing and outstation packages are 100% private. You have total freedom to spend more time at your favorite spots, skip places that don't interest you, or add customized stopovers for shopping or dining."
        },
        {
            "id": 4,
            "question": "How do I book and what are the payment options?",
            "answer": "You can book instantly online by submitting our booking form or sending a WhatsApp message to +91 70210 01921. Pay a small token advance via UPI / GPay / PhonePe to confirm, and settle the remaining balance directly with your chauffeur at trip completion."
        },
        {
            "id": 5,
            "question": "What is the cancellation policy?",
            "answer": "We offer free cancellation up to 6 hours before your scheduled pickup time for local Mumbai Darshan tours, and 12 hours prior for outstation trips. Any advance token is 100% refunded or credited towards your next ride."
        },
        {
            "id": 6,
            "question": "Are the cabs clean, sanitized, and air-conditioned?",
            "answer": "Yes. Every vehicle undergoes interior vacuuming and sanitization before dispatch. All cabs have fully functional, high-output air conditioning and verified commercial permits."
        },
        {
            "id": 7,
            "question": "Can I get doorstep pickup from Mumbai Airport or Navi Mumbai?",
            "answer": "Yes! We provide prompt doorstep pickup and drop across all locations: Chhatrapati Shivaji Maharaj International Airport (T1 & T2), South Mumbai hotels, Western Suburbs, Central Suburbs, Thane, and Navi Mumbai."
        }
    ]

    def make_lexical(text):
        return json.dumps({
            'root': {
                'children': [{
                    'children': [{
                        'detail': 0,
                        'format': 0,
                        'mode': 'normal',
                        'style': '',
                        'text': text,
                        'type': 'text',
                        'version': 1
                    }],
                    'direction': 'ltr',
                    'format': '',
                    'indent': 0,
                    'type': 'paragraph',
                    'version': 1
                }],
                'direction': 'ltr',
                'format': '',
                'indent': 0,
                'type': 'root',
                'version': 1
            }
        })

    dst_cur.execute("DELETE FROM faqs")
    for f in faq_items:
        dst_cur.execute("""
            INSERT INTO faqs (id, question, answer, updated_at, created_at)
            VALUES (?, ?, ?, ?, ?)
        """, (f["id"], f["question"], make_lexical(f["answer"]), now_iso, now_iso))
    print(f"  -> Seeded {len(faq_items)} FAQs")

    # 8. Populate Gallery
    gallery_items = [
        { "id": 1, "title": "Gateway of India Mumbai", "category": "Mumbai", "image_url": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?fit=crop&w=800&h=600&q=80" },
        { "id": 2, "title": "Lonavala Misty Ghats", "category": "Hill Stations", "image_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?fit=crop&w=800&h=600&q=80" },
        { "id": 3, "title": "Alibaug Clean Sea Shore", "category": "Beaches", "image_url": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?fit=crop&w=800&h=600&q=80" },
        { "id": 4, "title": "Shirdi Devotees Temple Darshan", "category": "Spiritual", "image_url": "https://images.unsplash.com/photo-1629640890590-7836d69c5237?fit=crop&w=800&h=600&q=80" },
        { "id": 5, "title": "Heritage Tourists Sightseeing", "category": "Mumbai", "image_url": "https://images.unsplash.com/photo-1567157577867-05ccb1388e66?fit=crop&w=800&h=600&q=80" },
        { "id": 6, "title": "Sahyadri Waterfall Tour", "category": "Hill Stations", "image_url": "https://images.unsplash.com/photo-1511497584788-87676104235f?fit=crop&w=800&h=600&q=80" },
        { "id": 7, "title": "Family Vacation Road Trip", "category": "Fleet", "image_url": "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?fit=crop&w=800&h=600&q=80" },
        { "id": 8, "title": "Western Ghats Scenic Viewpoint", "category": "Hill Stations", "image_url": "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?fit=crop&w=800&h=600&q=80" }
    ]

    dst_cur.execute("DELETE FROM gallery")
    for g in gallery_items:
        dst_cur.execute("""
            INSERT INTO gallery (id, title, category, image_url, updated_at, created_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (g["id"], g["title"], g["category"], g["image_url"], now_iso, now_iso))
    print(f"  -> Seeded {len(gallery_items)} gallery items")

    dst.commit()
    src.close()
    dst.close()
    print("✅ All content successfully synced into citytourcabs.db!")

if __name__ == '__main__':
    run_sync()
