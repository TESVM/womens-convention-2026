PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS site_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  draft_value TEXT NOT NULL DEFAULT '',
  published_value TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  last_updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_published_at TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_slug TEXT NOT NULL,
  key TEXT NOT NULL,
  draft_content TEXT NOT NULL DEFAULT '{}',
  published_content TEXT NOT NULL DEFAULT '{}',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(page_slug, key),
  FOREIGN KEY(page_slug) REFERENCES pages(slug) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS schedule_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  day_key TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  draft_time TEXT NOT NULL DEFAULT '',
  draft_title TEXT NOT NULL DEFAULT '',
  draft_description TEXT NOT NULL DEFAULT '',
  published_time TEXT NOT NULL DEFAULT '',
  published_title TEXT NOT NULL DEFAULT '',
  published_description TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS media_assets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL DEFAULT 'misc',
  draft_url TEXT NOT NULL DEFAULT '',
  published_url TEXT NOT NULL DEFAULT '',
  file_name TEXT NOT NULL DEFAULT '',
  mime_type TEXT NOT NULL DEFAULT '',
  size_bytes INTEGER NOT NULL DEFAULT 0,
  checksum TEXT NOT NULL DEFAULT '',
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_media_assets_checksum ON media_assets(checksum);
CREATE INDEX IF NOT EXISTS idx_schedule_items_day_sort ON schedule_items(day_key, sort_order);

CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL DEFAULT 'Administrator',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO pages (slug, title, status, last_updated_at, last_published_at)
VALUES ('home', 'AOH Women''s Convention 2026', 'draft', CURRENT_TIMESTAMP, '')
ON CONFLICT(slug) DO NOTHING;

-- Create an admin user after generating a password hash:
-- node scripts/hash-password.mjs "your-strong-password"
-- Then run:
-- INSERT INTO admin_users (username, password_hash, display_name)
-- VALUES ('admin', 'pbkdf2$...', 'AOH Admin');
