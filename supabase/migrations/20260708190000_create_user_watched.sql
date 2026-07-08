-- Per-user watched catalog. Drives recommendations input and /recommendations UI.

CREATE TABLE public.user_watched (
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  show_id INTEGER NOT NULL REFERENCES public.shows (id) ON DELETE CASCADE,
  watched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, show_id)
);

CREATE INDEX user_watched_user_id_watched_at_idx
  ON public.user_watched (user_id, watched_at DESC);

ALTER TABLE public.user_watched ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own watched shows"
  ON public.user_watched
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can mark shows watched"
  ON public.user_watched
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unmark watched shows"
  ON public.user_watched
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
