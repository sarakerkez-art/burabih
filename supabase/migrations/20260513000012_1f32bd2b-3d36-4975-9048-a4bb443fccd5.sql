
CREATE TABLE public.schools (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  school_name TEXT NOT NULL,
  city TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'interested',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a school signup (public form)
CREATE POLICY "Anyone can insert school signups"
  ON public.schools FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Public count: allow anyone to read minimal aggregate data via a SECURITY DEFINER function instead of exposing rows.
-- But spec says "Counter shows real count from Supabase". We'll expose a function for count only.
CREATE OR REPLACE FUNCTION public.schools_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int FROM public.schools;
$$;

GRANT EXECUTE ON FUNCTION public.schools_count() TO anon, authenticated;
