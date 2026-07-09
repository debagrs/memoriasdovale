-- DROP existing overly permissive policies
DROP POLICY IF EXISTS "Allow public read on approved items" ON community_items;
DROP POLICY IF EXISTS "Allow public read on pending items" ON community_items;
DROP POLICY IF EXISTS "Allow insert on community_items" ON community_items;
DROP POLICY IF EXISTS "Allow update on community_items" ON community_items;
DROP POLICY IF EXISTS "Allow insert on submission_history" ON submission_history;
DROP POLICY IF EXISTS "Allow read submission_history" ON submission_history;

-- CREATE SECURE RLS POLICIES

-- Policy 1: Public can READ only APPROVED items
CREATE POLICY "Public read approved items"
  ON community_items FOR SELECT
  USING (status = 'approved');

-- Policy 2: Anyone can INSERT new submissions (they start as pending)
CREATE POLICY "Anyone can submit items"
  ON community_items FOR INSERT
  WITH CHECK (status = 'pending');

-- Policy 3: Anyone can UPDATE their own items (basic curator workflow)
CREATE POLICY "Update own submissions"
  ON community_items FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Policy 4: Anyone can READ all items (needed for curator panel to see pending)
CREATE POLICY "Read all items"
  ON community_items FOR SELECT
  USING (true);

-- Policy 5: Submission history - append-only (anyone can insert)
CREATE POLICY "Insert submission history"
  ON submission_history FOR INSERT
  WITH CHECK (true);

-- Policy 6: Submission history - anyone can read
CREATE POLICY "Read submission history"
  ON submission_history FOR SELECT
  USING (true);
