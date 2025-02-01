# music

Purpose of this project is to have own data in my database about music I listen and have option to play with them on my own, via SQL. And also some have some fun during the process to learn supabase native features more. 

Project is based fully on [Supabase](https://supabase.com) free tier. 

Right now I download data from my Last.fm profile via theirs API to PostgreSQL via [Edge Function](https://supabase.com/docs/guides/functions) and [built-in cron extension](https://supabase.com/docs/guides/cron) which run every 5 minutes.

## Localhost

**start local dev server basd on docker**

```bash
supabase start
```

**run server to allow you to invoke Edge Functions locally**

```bash
supabase function serve --no-verify-jwt
```

## Roadmap

- [x] download and sync listened tracks from Last.fm every 5 minutes 
- [ ] fetch tags from last.fm to downloaded tracks: https://www.last.fm/api/show/track.getTags
- [ ] connect to spotify api, find track links to play them
- [ ] fetch detailed info about artists from last.fm or spotify
- [ ] fetch detailed info about albums from last.fm or spotify
