-- News table
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  headline TEXT NOT NULL,
  subheading TEXT,
  byline TEXT,
  body TEXT NOT NULL,
  credit TEXT,
  category TEXT DEFAULT 'news',
  author_email TEXT,
  status TEXT DEFAULT 'pending',
  location TEXT DEFAULT 'home-side',
  poster_url TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT now()
);

-- Advertisements table
CREATE TABLE IF NOT EXISTS advertisements (
  id SERIAL PRIMARY KEY,
  category TEXT DEFAULT 'news',
  title TEXT,
  heading TEXT,
  subheading TEXT,
  body TEXT,
  image_url TEXT,
  product_link TEXT,
  author_email TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

-- Schemes / Opportunities table
CREATE TABLE IF NOT EXISTS schemes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  subheading TEXT,
  organisation TEXT NOT NULL,
  scheme_type TEXT DEFAULT 'Central Government Scheme',
  description TEXT NOT NULL,
  eligibility TEXT,
  deadline TEXT,
  benefits TEXT,
  apply_link TEXT,
  keywords TEXT,
  poster_url TEXT DEFAULT '',
  author_email TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'news';
ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS heading TEXT;
ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS subheading TEXT;
ALTER TABLE advertisements ADD COLUMN IF NOT EXISTS product_link TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'home-side';
ALTER TABLE news ADD COLUMN IF NOT EXISTS poster_url TEXT DEFAULT '';
ALTER TABLE news ADD COLUMN IF NOT EXISTS subheading TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS reference_link TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS startup_name TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS product_name TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS startup_sector TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS startup_stage TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS editor_name TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS editor_designation TEXT;
ALTER TABLE news ADD COLUMN IF NOT EXISTS editor_affiliation TEXT;
ALTER TABLE schemes ADD COLUMN IF NOT EXISTS deadline TEXT;
ALTER TABLE schemes ADD COLUMN IF NOT EXISTS benefits TEXT;
ALTER TABLE schemes ADD COLUMN IF NOT EXISTS apply_link TEXT;
ALTER TABLE schemes ADD COLUMN IF NOT EXISTS subheading TEXT;
