import sqlite3
import os
import re

db_path = 'data/citytourcabs.db'
sql_path = 'drizzle_generated/0000_bitter_rhodey.sql'

print(f"Connecting to {db_path}...")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

def add_col(table, col, col_type):
    try:
        cursor.execute(f"PRAGMA table_info({table})")
        existing_cols = [row[1] for row in cursor.fetchall()]
        if existing_cols and col not in existing_cols:
            cursor.execute(f"ALTER TABLE {table} ADD COLUMN {col} {col_type}")
            print(f"  + Added column {table}.{col}")
    except Exception as e:
        pass

# Add columns to existing tables
fleet_cols = [
    ('category', 'TEXT'),
    ('tag', 'TEXT'),
    ('seats', 'TEXT'),
    ('configuration', 'TEXT'),
    ('boot_space', 'TEXT'),
    ('luggage', 'TEXT'),
    ('ac_type', 'TEXT'),
    ('fuel_type', 'TEXT'),
    ('rate_per_km', 'TEXT'),
    ('local_full_day', 'TEXT'),
    ('image_url', 'TEXT'),
    ('image_id', 'INTEGER'),
    ('best_for', 'TEXT'),
    ('features', 'TEXT'),
    ('seating', 'TEXT'),
    ('ac', 'INTEGER DEFAULT 1'),
    ('base_rate', 'TEXT'),
]
for col, ctype in fleet_cols:
    add_col('fleet', col, ctype)

for tbl in ['tours', 'pages']:
    add_col(tbl, 'seo_title', 'TEXT')
    add_col(tbl, 'seo_description', 'TEXT')
    add_col(tbl, 'seo_canonical', 'TEXT')

add_col('tours', 'display_order', 'INTEGER DEFAULT 100')
add_col('tours', 'starting_price', 'TEXT')

# Read and execute DDL from drizzle_generated/0000_bitter_rhodey.sql
print(f"Reading {sql_path}...")
with open(sql_path, 'r', encoding='utf-8') as f:
    sql_content = f.read()

statements = [s.strip() for s in sql_content.split('--> statement-breakpoint') if s.strip()]

applied = 0
for stmt in statements:
    # Ensure idempotency
    modified_stmt = re.sub(r'^CREATE TABLE\s+', 'CREATE TABLE IF NOT EXISTS ', stmt, flags=re.IGNORECASE)
    modified_stmt = re.sub(r'^CREATE INDEX\s+', 'CREATE INDEX IF NOT EXISTS ', modified_stmt, flags=re.IGNORECASE)
    modified_stmt = re.sub(r'^CREATE UNIQUE INDEX\s+', 'CREATE UNIQUE INDEX IF NOT EXISTS ', modified_stmt, flags=re.IGNORECASE)
    
    try:
        cursor.execute(modified_stmt)
        applied += 1
    except sqlite3.OperationalError as e:
        # Ignore already exists or column conflict
        pass
    except Exception as e:
        print(f"Error on: {modified_stmt[:60]}... -> {e}")

conn.commit()
print(f"✓ Successfully applied {applied} DDL statements.")

cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r[0] for r in cursor.fetchall()]
print(f"Total tables in database: {len(tables)}")
print(f"Contains 'users': {'users' in tables}")
print(f"Contains 'bookings': {'bookings' in tables}")

conn.close()
