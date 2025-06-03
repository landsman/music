-- allow authenticated users (cron) to save to the database

CREATE POLICY "insert_auth"
    ON public.listened
    FOR SELECT
    USING (true);

CREATE POLICY "insert_auth"
    ON public.hooman
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "insert_auth"
    ON public.hooman_artist
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "insert_auth"
    ON public.artist
    FOR INSERT
    TO authenticated
    WITH CHECK (true);