-- Vale Vêneto Memória e Música — Supabase schema definitivo
-- Rode este arquivo no SQL Editor do Supabase.

CREATE TABLE IF NOT EXISTS public.memories (
  id text PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('narrativa', 'ponto_mapa', 'festival', 'midia')),
  title text NOT NULL,
  author text NOT NULL,
  date text,
  content text NOT NULL,
  category text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  media_url text,
  media_type text DEFAULT 'none' CHECK (media_type IN ('image', 'video', 'audio', 'document', 'none')),
  media_file_name text,
  lat_x numeric,
  lat_y numeric,
  audio_mood text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "memories_select_public" ON public.memories;
DROP POLICY IF EXISTS "memories_insert_public" ON public.memories;
DROP POLICY IF EXISTS "memories_update_public" ON public.memories;

CREATE POLICY "memories_select_public"
ON public.memories
FOR SELECT
USING (true);

CREATE POLICY "memories_insert_public"
ON public.memories
FOR INSERT
WITH CHECK (true);

CREATE POLICY "memories_update_public"
ON public.memories
FOR UPDATE
USING (true)
WITH CHECK (true);

-- Bucket público para fotos, vídeos, áudios e documentos das memórias.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'memories-media',
  'memories-media',
  true,
  26214400,
  ARRAY[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'video/mp4',
    'video/quicktime',
    'video/webm',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
    'audio/mp4',
    'audio/x-m4a',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

DROP POLICY IF EXISTS "memories_media_select_public" ON storage.objects;
DROP POLICY IF EXISTS "memories_media_insert_public" ON storage.objects;
DROP POLICY IF EXISTS "memories_media_update_public" ON storage.objects;

CREATE POLICY "memories_media_select_public"
ON storage.objects
FOR SELECT
USING (bucket_id = 'memories-media');

CREATE POLICY "memories_media_insert_public"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'memories-media');

CREATE POLICY "memories_media_update_public"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'memories-media')
WITH CHECK (bucket_id = 'memories-media');

-- Seeds mínimos para a página nunca abrir vazia quando conectada ao banco.
INSERT INTO public.memories (id, type, title, author, date, content, category, status, media_type, lat_x, lat_y, audio_mood)
VALUES
  ('seed-igreja-corpus-domini', 'ponto_mapa', 'Igreja Corpus Domini', 'Curadoria Vale Vêneto', '2026-07-09', 'Marco espiritual e arquitetônico do Vale Vêneto, associado à memória da imigração italiana e à vida comunitária local.', 'Religião', 'approved', 'none', 50, 35, 'Sinos de bronze ressonando no vale'),
  ('seed-festival-inverno', 'festival', 'Festival de Inverno da UFSM', 'Curadoria Vale Vêneto', '2026-07-09', 'Memória musical da região, reunindo estudantes, professores, comunidade e repertórios que atravessam gerações.', 'Música Clássica', 'approved', 'none', null, null, 'Ensaios de cordas, sopros e vozes no inverno'),
  ('seed-gastronomia-colonial', 'narrativa', 'Mesa colonial e memória familiar', 'Curadoria Vale Vêneto', '2026-07-09', 'A gastronomia colonial preserva gestos, afetos, modos de fazer e narrativas familiares transmitidas entre gerações.', 'Gastronomia', 'approved', 'none', null, null, 'Fogão a lenha e conversa ao redor da mesa')
ON CONFLICT (id) DO NOTHING;
