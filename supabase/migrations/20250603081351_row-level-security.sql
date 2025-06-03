BEGIN;

-- Enable Row Level Security on the listened table
ALTER TABLE public.listened ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow unauthenticated access
CREATE POLICY "Allow unauthenticated access"
    ON public.listened
    FOR SELECT
    USING (true);

COMMIT;
