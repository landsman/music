UPDATE "listened"
SET hooman_id = (SELECT id FROM hooman WHERE lastfm_user = 'Insuit')
WHERE hooman_id IS NULL;