-- Drop duplicate SELECT policies that cause multiple permissive policy warnings.
-- The select_public policy (USING (true)) covers all roles including anon and authenticated.
DROP POLICY IF EXISTS select_artist ON public.artist;
DROP POLICY IF EXISTS "Allow public read access" ON public.hooman;
