-- Shows catalog + vector embeddings for GenAI recommendations.
-- Data seeding is a separate step (service role or admin tooling).

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

CREATE TABLE public.shows (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  language TEXT NOT NULL,
  genres TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL,
  premiered TIMESTAMPTZ,
  ended TIMESTAMPTZ,
  weight INTEGER NOT NULL,
  image TEXT,
  summary TEXT NOT NULL,
  enriched_tags JSONB,
  enriched_tags_at TIMESTAMPTZ
);

CREATE TABLE public.shows_embeddings (
  show_id INTEGER PRIMARY KEY,
  embedding extensions.vector(768) NOT NULL,
  model TEXT NOT NULL DEFAULT 'nomic-embed-text',
  embedded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT shows_embeddings_show_id_shows_id_fk
    FOREIGN KEY (show_id)
    REFERENCES public.shows (id)
    ON DELETE CASCADE
);

CREATE INDEX shows_embeddings_embedding_hnsw_idx
  ON public.shows_embeddings
  USING hnsw (embedding vector_cosine_ops);

ALTER TABLE public.shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shows_embeddings ENABLE ROW LEVEL SECURITY;

-- Catalog: authenticated users can browse (matches protected /shows routes).
CREATE POLICY "Authenticated users can read shows"
  ON public.shows
  FOR SELECT
  TO authenticated
  USING (true);

-- No INSERT/UPDATE/DELETE policies on shows: writes via service role (admin seed).
-- No policies on shows_embeddings: reads/writes via service role (FastAPI / batch jobs).
