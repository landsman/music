-- run this on your postgresql database (supabase)

CREATE TABLE scrobbles
(
    id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    track     TEXT        NOT NULL,
    artist    TEXT        NOT NULL,
    album     TEXT,
    timestamp TIMESTAMPTZ NOT NULL,
    url       TEXT
);

-- Optional: Create an index for faster queries
CREATE INDEX idx_timestamp ON scrobbles (timestamp DESC);
