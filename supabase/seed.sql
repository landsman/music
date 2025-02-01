CREATE TABLE listened
(
    id          UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL,
    listened_at TIMESTAMPTZ NOT NULL,
    artist_name TEXT        NOT NULL,
    track_name  TEXT        NOT NULL,
    album_name  TEXT,
    lastfm_data jsonb DEFAULT NULL
);

CREATE INDEX idx_created_at ON listened (created_at DESC);
CREATE INDEX idx_listened_at ON listened (listened_at DESC);
