-- Enable Row Level Security on the listened table
-- Create a policy to allow unauthenticated access

BEGIN;

ALTER TABLE public.listened ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow unauthenticated access"
    ON public.listened
    FOR SELECT
    USING (true);

ALTER TABLE public.hooman ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.hooman
    FOR SELECT
    USING (true);

ALTER TABLE public.hooman_artist ENABLE ROW LEVEL SECURITY;
CREATE POLICY select_public ON public.hooman_artist
    FOR SELECT
    USING (true);

ALTER TABLE public.artist ENABLE ROW LEVEL SECURITY;
CREATE POLICY select_artist ON public.artist
    FOR SELECT
    USING (true);

COMMIT;

