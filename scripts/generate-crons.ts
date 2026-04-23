import { buildCron, buildUnschedule } from "../supabase/functions/_shared/cron.ts";
import { recentTracksCron } from "../supabase/functions/lastfm-user-recent-tracks/sync-tracks.ts";
import { libraryArtistsCron } from "../supabase/functions/lastfm-library-artists/sync-artists.ts";
import { LASTFM_USERS } from "../supabase/functions/_shared/users.ts";

const PROJECT_ID = Deno.env.get("PROJECT_ID");
if (!PROJECT_ID) throw new Error("Missing environment variable: PROJECT_ID");

const unschedule = LASTFM_USERS.flatMap((user) => [
  buildUnschedule(recentTracksCron, user),
  buildUnschedule(libraryArtistsCron, user),
]);

const schedule = LASTFM_USERS.flatMap((user) => [
  buildCron(recentTracksCron, PROJECT_ID, user),
  buildCron(libraryArtistsCron, PROJECT_ID, user),
]);

const output = [
  "-- unschedule all existing cron jobs before reapplying",
  unschedule.join(""),
  "-- schedule cron jobs",
  schedule.join("\n"),
].join("\n");

const timestamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
const migrationFile = `supabase/migrations/${timestamp}_cron-jobs.sql`;

await Deno.writeTextFile(migrationFile, output);
console.log(migrationFile);
