import { env } from "../_shared/env.ts";
import { SentryErrorHandler } from "../_shared/sentry.ts";
import { getLastFmUser } from "../_shared/lastfm/request-fields.ts";
import { RECENT_TRACKS_CRON_SCHEDULE, syncTracks } from "./sync-tracks.ts";

const sentryHandler = new SentryErrorHandler(env.DEVELOPER_MODE);
sentryHandler.init();

Deno.serve(async (req) => {
  try {
    const lastFmUser = await getLastFmUser(req, env.LASTFM_USERNAME);
    const monitorSlug = `lastfm_user_recent_tracks_${lastFmUser.toLowerCase()}`;

    const result = await sentryHandler.withCronMonitor(
      monitorSlug,
      {
        schedule: { type: "crontab", value: RECENT_TRACKS_CRON_SCHEDULE },
        checkinMargin: 5,
        maxRuntime: 4,
        timezone: "UTC",
      },
      () => syncTracks(env, lastFmUser),
    );

    return new Response(result, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (e) {
    sentryHandler.logFatalError(e);
    return new Response("error occured, please check sentry/supabase logs", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
});
