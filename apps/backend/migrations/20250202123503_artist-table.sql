-- rename indexes
DROP INDEX IF EXISTS idx_lastfm_user;
CREATE INDEX idx_hooman_lastfm_user ON hooman (lastfm_user DESC);

DROP INDEX IF EXISTS idx_created_at;
CREATE INDEX idx_listened_created_at ON listened (created_at DESC);

DROP INDEX IF EXISTS idx_listened_at;
CREATE INDEX idx_listened_listened_at ON listened (listened_at DESC);

-- new table for artists
CREATE TABLE artist
(
    id          UUID  DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL,
    name        TEXT,
    lastfm_data jsonb DEFAULT NULL
);

ALTER TABLE artist
    ADD CONSTRAINT uq_artist_unique_name UNIQUE (name);

CREATE INDEX idx_artist_created_at ON artist (created_at DESC);
CREATE INDEX idx_artist_name ON artist (name ASC);

-- pair table user <> artist
CREATE TABLE hooman_artist
(
    id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL,
    hooman_id  UUID        NOT NULL,
    artist_id  UUID        NOT NULL
);

ALTER TABLE hooman_artist
    ADD CONSTRAINT uq_hooman_artist_id UNIQUE (hooman_id, artist_id);

CREATE INDEX idx_hooman_artist_hooman_id ON hooman_artist (hooman_id DESC);

CREATE VIEW hooman_artist_count AS
SELECT h.lastfm_user, COUNT(ha.id) as count
FROM hooman_artist ha
         LEFT JOIN hooman h ON ha.hooman_id = h.id
GROUP BY h.lastfm_user
ORDER BY count DESC;

-- view for hooman matches based on artists
CREATE VIEW hooman_artist_match AS
SELECT a.id, a.created_at, a.name,
       string_agg(h.lastfm_user, ',') AS hooman_match
FROM artist a
         JOIN hooman_artist ha ON a.id = ha.artist_id
         JOIN hooman h ON h.id = ha.hooman_id
GROUP BY a.id, a.created_at, a.name
HAVING count(distinct h.lastfm_user) >= 2
ORDER BY a.created_at DESC;