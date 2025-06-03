-- fix of the previous migration: allow authenticated users (cron) to save to the database

DROP POLICY IF EXISTS "insert_auth" ON public.listened;
CREATE POLICY "insert_auth"
    ON public.listened
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

