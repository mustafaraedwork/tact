-- Create storage buckets if they don't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('kitchens', 'kitchens', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('quiz-images', 'quiz-images', true)
ON CONFLICT (id) DO NOTHING;

-- Ensure policies allow public access (in case they were missed)
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id IN ('kitchens', 'quiz-images') );
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK ( bucket_id IN ('kitchens', 'quiz-images') );
CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE TO authenticated USING ( bucket_id IN ('kitchens', 'quiz-images') );
