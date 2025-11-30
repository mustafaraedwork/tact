-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Kitchens Table
CREATE TABLE kitchens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  material TEXT, -- hdf, plywood, acrylic
  kitchen_type TEXT, -- straight, L, U
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Kitchen Images Table
CREATE TABLE kitchen_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kitchen_id UUID REFERENCES kitchens(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Kitchen Videos Table
CREATE TABLE kitchen_videos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kitchen_id UUID REFERENCES kitchens(id) ON DELETE CASCADE,
  youtube_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Quiz Selection Images Table
CREATE TABLE quiz_selection_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  title TEXT,
  category TEXT,
  display_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Contact Requests Table
CREATE TABLE contact_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  phone TEXT NOT NULL,
  governorate TEXT NOT NULL,
  area TEXT,
  message TEXT,
  source TEXT, -- 'cost_calculator', 'contact_form', 'gallery'
  kitchen_type TEXT,
  dimensions JSONB, -- {wall1: 3.5, wall2: 2.5, wall3: 4}
  selected_designs JSONB, -- array of image ids
  material TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Governorates Table
CREATE TABLE governorates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_ar TEXT NOT NULL,
  display_order INTEGER
);

-- Insert Governorates
INSERT INTO governorates (name_ar, display_order) VALUES
('بغداد', 1),
('الأنبار', 2),
('أربيل', 3),
('بابل', 4),
('البصرة', 5),
('دهوك', 6),
('ديالى', 7),
('ذي قار', 8),
('السليمانية', 9),
('صلاح الدين', 10),
('القادسية', 11),
('كربلاء', 12),
('كركوك', 13),
('المثنى', 14),
('ميسان', 15),
('النجف', 16),
('نينوى', 17),
('واسط', 18);

-- 7. Company Info Table
CREATE TABLE company_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT DEFAULT 'TACT',
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT DEFAULT 'بغداد - العامرية',
  map_lat DECIMAL,
  map_lng DECIMAL,
  facebook_url TEXT,
  instagram_url TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert Initial Company Info
INSERT INTO company_info (company_name, address) VALUES ('TACT', 'بغداد - العامرية');

-- 8. Admin Users Table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security (RLS) Policies (Basic Setup)
ALTER TABLE kitchens ENABLE ROW LEVEL SECURITY;
ALTER TABLE kitchen_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE kitchen_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_selection_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE governorates ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Public Read Access
CREATE POLICY "Public kitchens are viewable by everyone" ON kitchens FOR SELECT USING (true);
CREATE POLICY "Public images are viewable by everyone" ON kitchen_images FOR SELECT USING (true);
CREATE POLICY "Public videos are viewable by everyone" ON kitchen_videos FOR SELECT USING (true);
CREATE POLICY "Public quiz images are viewable by everyone" ON quiz_selection_images FOR SELECT USING (true);
CREATE POLICY "Public governorates are viewable by everyone" ON governorates FOR SELECT USING (true);
CREATE POLICY "Public company info is viewable by everyone" ON company_info FOR SELECT USING (true);

-- Contact Requests: Insert by everyone, View by Admin only
CREATE POLICY "Anyone can create contact requests" ON contact_requests FOR INSERT WITH CHECK (true);

-- Storage Buckets (You need to create these in Supabase Dashboard > Storage)
-- 'kitchens'
-- 'quiz-images'
