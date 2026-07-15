-- Per-user recommendation cache. Fingerprint invalidates when watch history changes.

CREATE TABLE public.user_recommendations (
  user_id UUID PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
  history_fingerprint TEXT NOT NULL,
  recommendations JSONB NOT NULL DEFAULT '[]'::jsonb,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_recommendations_recommendations_is_array
    CHECK (jsonb_typeof(recommendations) = 'array')
);

ALTER TABLE public.user_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own recommendation cache"
  ON public.user_recommendations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recommendation cache"
  ON public.user_recommendations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recommendation cache"
  ON public.user_recommendations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own recommendation cache"
  ON public.user_recommendations
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
