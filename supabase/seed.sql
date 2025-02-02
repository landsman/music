-- hooman (users)
CREATE TABLE hooman
(
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL,
    lastfm_user TEXT        NOT NULL
);

CREATE INDEX idx_hooman_lastfm_user ON hooman (lastfm_user DESC);

-- listened tracks
CREATE TABLE listened
(
    id          UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL,
    listened_at TIMESTAMPTZ NOT NULL,
    artist_name TEXT        NOT NULL,
    track_name  TEXT        NOT NULL,
    album_name  TEXT,
    lastfm_data jsonb DEFAULT NULL,
    hooman_id   UUID        NOT NULL
);

CREATE INDEX idx_listened_created_at ON listened (created_at DESC);
CREATE INDEX idx_listened_listened_at ON listened (listened_at DESC);

CREATE VIEW listened_count AS
SELECT hooman.lastfm_user,
       COUNT(listened.id) as count
FROM listened
         LEFT JOIN hooman ON listened.hooman_id = hooman.id
GROUP BY hooman.lastfm_user
ORDER BY count DESC
;

-- artist
CREATE TABLE artist
(
    id          UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL,
    name        TEXT,
    lastfm_data jsonb DEFAULT NULL
);

ALTER TABLE artist
    ADD CONSTRAINT uq_artist_unique_name UNIQUE (name, lastfm_id);

CREATE INDEX idx_artist_created_at ON artist (created_at DESC);
CREATE INDEX idx_artist_name ON artist (name DESC);

CREATE VIEW hooman_artist_count AS
SELECT h.lastfm_user, COUNT(ha.id) as count
FROM hooman_artist ha
         LEFT JOIN hooman h ON ha.hooman_id = h.id
GROUP BY h.lastfm_user
ORDER BY count DESC
;

CREATE VIEW hooman_artist_match AS
SELECT a.id, a.created_at, a.name, string_agg(h.lastfm_user, ',') AS lastfm_users
FROM artist a
         LEFT JOIN hooman_artist ha ON a.id = ha.artist_id
         LEFT JOIN hooman h ON h.id = ha.hooman_id
GROUP BY a.id, a.created_at, a.name
ORDER BY a.created_at DESC
;
