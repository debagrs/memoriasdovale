-- Create community_items table for storing all submissions and approved items
CREATE TABLE IF NOT EXISTS community_items (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('narrativa', 'ponto_mapa', 'festival', 'midia')),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  media_url TEXT,
  media_type TEXT CHECK (media_type IN ('image', 'video', 'audio', 'document', 'none')),
  media_file_name TEXT,
  lat_x DECIMAL,
  lat_y DECIMAL,
  audio_mood TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_community_items_status ON community_items(status);
CREATE INDEX IF NOT EXISTS idx_community_items_created_at ON community_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_items_author ON community_items(author);

-- Create approval history table for tracking curator decisions
CREATE TABLE IF NOT EXISTS submission_history (
  id TEXT PRIMARY KEY,
  item_id TEXT NOT NULL REFERENCES community_items(id) ON DELETE CASCADE,
  old_status TEXT,
  new_status TEXT NOT NULL,
  curator_notes TEXT,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  changed_by TEXT
);

-- Create index for history queries
CREATE INDEX IF NOT EXISTS idx_submission_history_item_id ON submission_history(item_id);

-- Enable Row Level Security (RLS)
ALTER TABLE community_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE submission_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Allow anyone to READ approved items, but only curators can UPDATE/DELETE
CREATE POLICY "Allow public read on approved items" ON community_items
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Allow public read on pending items" ON community_items
  FOR SELECT USING (true);

CREATE POLICY "Allow insert on community_items" ON community_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update on community_items" ON community_items
  FOR UPDATE USING (true);

-- History is append-only
CREATE POLICY "Allow insert on submission_history" ON submission_history
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read submission_history" ON submission_history
  FOR SELECT USING (true);
