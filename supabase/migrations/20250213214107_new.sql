ALTER TABLE listened
    DROP CONSTRAINT IF EXISTS fk_listened_hooman,
    ADD CONSTRAINT fk_listened_hooman
        FOREIGN KEY (hooman_id)
            REFERENCES hooman (id);
