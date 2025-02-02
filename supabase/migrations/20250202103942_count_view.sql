CREATE VIEW listened_count AS
SELECT hooman.lastfm_user,
       COUNT(listened.id) as count
FROM listened
         LEFT JOIN hooman ON listened.hooman_id = hooman.id
GROUP BY hooman.lastfm_user
ORDER BY count DESC
;