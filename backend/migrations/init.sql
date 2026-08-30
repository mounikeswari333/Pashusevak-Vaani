-- Simple table to store join requests
CREATE TABLE IF NOT EXISTS join_requests (
  id SERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL,
  email TEXT,
  mobile_number TEXT,
  country TEXT,
  state TEXT,
  district TEXT,
  village TEXT,
  entity_name TEXT,
  entity_address TEXT,
  extra JSONB,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

-- Example row
INSERT INTO join_requests (full_name, role, email, mobile_number, country, state, district, village) VALUES ('Test User', 'volunteer', 'test@example.com', '1234567890', 'India', 'Uttar Pradesh', 'Lucknow', 'Chinhat');
