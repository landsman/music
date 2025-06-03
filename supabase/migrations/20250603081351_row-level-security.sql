-- Enable Row Level Security on the listened table
-- Create a policy to allow unauthenticated access

BEGIN;

ALTER TABLE public.listened ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow unauthenticated access" ON public.listened;
CREATE POLICY "select_public"
    ON public.listened
    FOR SELECT
    USING (true);

ALTER TABLE public.hooman ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow unauthenticated access" ON public.hooman;
CREATE POLICY "select_public" ON public.hooman
    FOR SELECT
    USING (true);

ALTER TABLE public.hooman_artist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_public" ON public.hooman_artist;
CREATE POLICY select_public ON public.hooman_artist
    FOR SELECT
    USING (true);

ALTER TABLE public.artist ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "select_public" ON public.artist;
CREATE POLICY select_public ON public.artist
    FOR SELECT
    USING (true);

COMMIT;

