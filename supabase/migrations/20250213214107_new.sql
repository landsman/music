ALTER TABLE listened
    DROP CONSTRAINT IF EXISTS fk_listened_hooman,
    ADD CONSTRAINT fk_listened_hooman
        FOREIGN KEY (hooman_id)
            REFERENCES hooman (id);

ALTER TABLE hooman_artist
    DROP CONSTRAINT IF EXISTS fk_hooman_artist_hooman,
    ADD CONSTRAINT fk_hooman_artist_hooman
        FOREIGN KEY (hooman_id)
            REFERENCES hooman (id);

ALTER TABLE hooman_artist
    DROP CONSTRAINT IF EXISTS fk_hooman_artist_artist,
    ADD CONSTRAINT fk_hooman_artist_artist
        FOREIGN KEY (artist_id)
            REFERENCES artist (id);