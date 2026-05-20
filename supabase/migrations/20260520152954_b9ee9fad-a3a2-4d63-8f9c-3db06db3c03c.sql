
CREATE TABLE public.partner_interest (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  type text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_interest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert partner interest"
ON public.partner_interest
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
