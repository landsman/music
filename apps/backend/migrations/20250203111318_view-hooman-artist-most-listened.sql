CREATE VIEW hooman_artist_most_listened AS
SELECT l.artist_name AS artist,
       h.lastfm_user AS hooman,
       COUNT(l.id)   AS count
FROM listened l
         JOIN
     hooman h ON l.hooman_id = h.id
GROUP BY l.artist_name, h.lastfm_user
ORDER BY count DESC;

CREATE VIEW hooman_tracks_most_listened AS
SELECT l.track_name  AS track,
       h.lastfm_user AS hooman,
       COUNT(l.id)   AS count
FROM listened l
         JOIN hooman h ON l.hooman_id = h.id
GROUP BY l.track_name, h.lastfm_user
ORDER BY count DESC;
