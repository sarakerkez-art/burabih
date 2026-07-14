REVOKE SELECT, UPDATE, DELETE ON public.waitlist FROM anon, authenticated;
GRANT INSERT ON public.waitlist TO anon;
GRANT INSERT ON public.waitlist TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.waitlist TO service_role;