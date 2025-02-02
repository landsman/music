# music

The purpose of this project is to store data about the music I listen to in my own database and to query it using SQL.
I also want to have fun while learning more about [Supabase](https://supabase.com) native features.

Currently, I am downloading all historical data from my Last.fm profile 
using its API to PostgresSQL via [Edge Functions](https://supabase.com/docs/guides/functions) and the [built-in cron extension](https://supabase.com/docs/guides/cron),
which run every 5 minutes and download 500 items.

## Roadmap

- [x] download and sync listened tracks from Last.fm every 5 minutes 
- [ ] fetch tags from last.fm to downloaded tracks: https://www.last.fm/api/show/track.getTags
- [ ] connect to spotify api, find track links to play them
- [ ] fetch detailed info about artists from last.fm or spotify
- [ ] fetch detailed info about albums from last.fm or spotify

## Tools

- Read [documentation](.docs/README.md) about localhost setup and cloud configuration
- [IntelliJ IDEA](https://www.jetbrains.com/idea/) as a code editor
- [Docker](https://docs.docker.com/get-started/get-docker/) for a localhost studio
- [Deno](https://deno.com)
- [Bruno](https://www.usebruno.com) for easy debugging
- [Supabase](https://supabase.com) account
- [Last.fm](https://www.last.fm/home) account [connected to Spotify](https://www.last.fm/about/trackmymusic), [API key](https://www.last.fm/api/authentication)
- [Sentry](https://sentry.io/) for error notifications

