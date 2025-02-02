CREATE TABLE listened
(
    id          UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL,
    listened_at TIMESTAMPTZ NOT NULL,
    artist_name TEXT        NOT NULL,
    track_name  TEXT        NOT NULL,
    album_name  TEXT,
    lastfm_data jsonb DEFAULT NULL,
    hooman_id   UUID NOT NULL
);

CREATE INDEX idx_created_at ON listened (created_at DESC);
CREATE INDEX idx_listened_at ON listened (listened_at DESC);

CREATE TABLE hooman
(
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL,
    lastfm_user TEXT        NOT NULL
);

CREATE INDEX idx_lastfm_user ON hooman (lastfm_user DESC);
