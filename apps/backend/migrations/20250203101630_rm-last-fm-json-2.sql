UPDATE listened SET lastfm_id = lastfm_data->>'mbid' WHERE lastfm_data->>'mbid' != '';

ALTER TABLE listened ADD COLUMN album_lastfm_id TEXT DEFAULT NULL;
UPDATE listened SET album_lastfm_id = lastfm_data->'album'->>'mbid' WHERE lastfm_data->'album'->>'mbid' != '';

ALTER TABLE listened DROP COLUMN lastfm_data;

UPDATE artist SET lastfm_id = lastfm_data->>'mbid' WHERE lastfm_data->>'mbid' != '';
ALTER TABLE artist DROP COLUMN lastfm_data;