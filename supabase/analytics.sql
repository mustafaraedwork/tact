-- Create Page Visits Table
CREATE TABLE IF NOT EXISTS page_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path TEXT NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE page_visits ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public tracking)
CREATE POLICY "Anyone can insert page visits" ON page_visits FOR INSERT WITH CHECK (true);

-- Allow admins to view (you might need to adjust this based on your auth setup, 
-- but for now we can allow public read or restrict to authenticated)
-- Let's restrict to authenticated users (admins) for viewing
CREATE POLICY "Authenticated users can view page visits" ON page_visits FOR SELECT USING (auth.role() = 'authenticated');
