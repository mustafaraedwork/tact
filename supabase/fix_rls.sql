-- Allow authenticated users (admins) to view contact requests
CREATE POLICY "Authenticated users can view contact requests" 
ON contact_requests FOR SELECT 
TO authenticated 
USING (true);

-- Allow authenticated users to view/edit company info (if not already public)
-- (Company info is already public read, but we need update for admin)
CREATE POLICY "Authenticated users can update company info" 
ON company_info FOR UPDATE
TO authenticated 
USING (true)
WITH CHECK (true);

-- Allow authenticated users to manage governorates
CREATE POLICY "Authenticated users can insert governorates" 
ON governorates FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete governorates" 
ON governorates FOR DELETE 
TO authenticated 
USING (true);

-- Allow authenticated users to manage kitchens
CREATE POLICY "Authenticated users can insert kitchens" ON kitchens FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update kitchens" ON kitchens FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete kitchens" ON kitchens FOR DELETE TO authenticated USING (true);

-- Allow authenticated users to manage kitchen images
CREATE POLICY "Authenticated users can insert kitchen_images" ON kitchen_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete kitchen_images" ON kitchen_images FOR DELETE TO authenticated USING (true);

-- Allow authenticated users to manage kitchen videos
CREATE POLICY "Authenticated users can insert kitchen_videos" ON kitchen_videos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can delete kitchen_videos" ON kitchen_videos FOR DELETE TO authenticated USING (true);

-- Allow authenticated users to manage quiz images
CREATE POLICY "Authenticated users can insert quiz_selection_images" ON quiz_selection_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update quiz_selection_images" ON quiz_selection_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete quiz_selection_images" ON quiz_selection_images FOR DELETE TO authenticated USING (true);

-- Allow authenticated users to update contact requests (mark as read)
CREATE POLICY "Authenticated users can update contact requests" ON contact_requests FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete contact requests" ON contact_requests FOR DELETE TO authenticated USING (true);
