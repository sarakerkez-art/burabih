
-- 1) Pin search_path on SECURITY DEFINER email-queue functions
ALTER FUNCTION public.enqueue_email(text, jsonb) SET search_path = public;
ALTER FUNCTION public.delete_email(text, bigint) SET search_path = public;
ALTER FUNCTION public.read_email_batch(text, integer, integer) SET search_path = public;
ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb) SET search_path = public;

-- 2) Revoke EXECUTE from anon/authenticated/PUBLIC on all SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.delete_email(text, bigint) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enqueue_email(text, jsonb) TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_email(text, bigint) TO service_role;
GRANT EXECUTE ON FUNCTION public.read_email_batch(text, integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public.move_to_dlq(text, text, bigint, jsonb) TO service_role;

-- schools_count is unused by the app; restrict it as well
REVOKE EXECUTE ON FUNCTION public.schools_count() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.schools_count() TO service_role;

-- 3) Replace WITH CHECK (true) with real validation on public-submission tables
DROP POLICY IF EXISTS "Anyone can insert waitlist signups" ON public.waitlist;
CREATE POLICY "Anyone can insert waitlist signups"
  ON public.waitlist
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND length(email) BETWEEN 5 AND 320
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND (city IS NULL OR length(city) <= 120)
  );

DROP POLICY IF EXISTS "Anyone can insert school signups" ON public.schools;
CREATE POLICY "Anyone can insert school signups"
  ON public.schools
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND length(email) BETWEEN 5 AND 320
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(school_name) BETWEEN 1 AND 200
    AND length(city) BETWEEN 1 AND 120
    AND length(contact_name) BETWEEN 1 AND 200
  );

DROP POLICY IF EXISTS "Anyone can insert partner interest" ON public.partner_interest;
CREATE POLICY "Anyone can insert partner interest"
  ON public.partner_interest
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    email IS NOT NULL
    AND length(email) BETWEEN 5 AND 320
    AND email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(name) BETWEEN 1 AND 200
    AND length(message) BETWEEN 1 AND 5000
    AND type IN ('partner','sponsor','press','school','ngo','government','researcher','other')
  );
