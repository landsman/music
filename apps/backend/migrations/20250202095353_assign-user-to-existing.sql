CREATE INDEX idx_lastfm_user ON hooman (lastfm_user DESC);

UPDATE "listened"
SET hooman_id = (SELECT id FROM hooman WHERE lastfm_user = 'Insuit')
WHERE hooman_id IS NULL;

