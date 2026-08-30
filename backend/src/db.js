const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function ensureSchema() {
  await pool.query(`
    ALTER TABLE IF EXISTS advertisements
      ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'news',
      ADD COLUMN IF NOT EXISTS body TEXT,
      ADD COLUMN IF NOT EXISTS heading TEXT,
      ADD COLUMN IF NOT EXISTS subheading TEXT,
      ADD COLUMN IF NOT EXISTS product_link TEXT;
  `);

  await pool.query(`
    ALTER TABLE IF EXISTS news
      ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'news',
      ADD COLUMN IF NOT EXISTS author_email TEXT,
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS location TEXT DEFAULT 'home-side',
      ADD COLUMN IF NOT EXISTS poster_url TEXT DEFAULT '',
      ADD COLUMN IF NOT EXISTS subheading TEXT,
      ADD COLUMN IF NOT EXISTS reference_link TEXT,
      ADD COLUMN IF NOT EXISTS startup_name TEXT,
      ADD COLUMN IF NOT EXISTS product_name TEXT,
      ADD COLUMN IF NOT EXISTS startup_sector TEXT,
      ADD COLUMN IF NOT EXISTS startup_stage TEXT,
      ADD COLUMN IF NOT EXISTS editor_name TEXT,
      ADD COLUMN IF NOT EXISTS editor_designation TEXT,
      ADD COLUMN IF NOT EXISTS editor_affiliation TEXT,
      ADD COLUMN IF NOT EXISTS headline_i18n JSONB,
      ADD COLUMN IF NOT EXISTS subheading_i18n JSONB,
      ADD COLUMN IF NOT EXISTS byline_i18n JSONB,
      ADD COLUMN IF NOT EXISTS body_i18n JSONB,
      ADD COLUMN IF NOT EXISTS credit_i18n JSONB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS schemes (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      organisation TEXT NOT NULL,
      scheme_type TEXT DEFAULT 'Central Government Scheme',
      description TEXT NOT NULL,
      eligibility TEXT,
      benefits TEXT,
      apply_link TEXT,
      keywords TEXT,
      poster_url TEXT DEFAULT '',
      author_email TEXT,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT now()
    );
  `);

  await pool.query(`
    ALTER TABLE IF EXISTS schemes
      ADD COLUMN IF NOT EXISTS scheme_type TEXT DEFAULT 'Central Government Scheme',
      ADD COLUMN IF NOT EXISTS subheading TEXT,
      ADD COLUMN IF NOT EXISTS benefits TEXT,
      ADD COLUMN IF NOT EXISTS apply_link TEXT,
      ADD COLUMN IF NOT EXISTS deadline TEXT;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS subscribers (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      schemes BOOLEAN DEFAULT false,
      market BOOLEAN DEFAULT false,
      hindi BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT now()
    );
  `);
}

module.exports = {
  query: (text, params) => pool.query(text, params),
  ensureSchema,
};
