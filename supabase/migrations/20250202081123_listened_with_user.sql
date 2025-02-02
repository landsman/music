CREATE TABLE hooman
(
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL,
    lastfm_user TEXT        NOT NULL
);

ALTER TABLE listened ADD COLUMN hooman_id UUID DEFAULT NULL;