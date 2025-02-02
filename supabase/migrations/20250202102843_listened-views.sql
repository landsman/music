CREATE VIEW listened_by_michal AS
SELECT
    listened.listened_at,
    listened.artist_name,
    listened.track_name,
    listened.album_name
FROM
    listened
        LEFT JOIN hooman ON listened.hooman_id = hooman.id
WHERE hooman.lastfm_user = 'Insuit'
ORDER BY listened_at DESC
;

CREATE VIEW listened_by_kacka AS
SELECT
    listened.listened_at,
    listened.artist_name,
    listened.track_name,
    listened.album_name
FROM
    listened
        LEFT JOIN hooman ON listened.hooman_id = hooman.id
WHERE hooman.lastfm_user = 'Weinkaa'
ORDER BY listened_at DESC
;
