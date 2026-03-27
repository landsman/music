import { SentryErrorHandler } from "../_shared/sentry.ts";
import { env } from "../_shared/env.ts";
import { getLastFmUser } from "../_shared/lastfm/request-fields.ts";
import { syncArtists } from "./sync-artists.ts";

const sentryHandler = new SentryErrorHandler(env.DEVELOPER_MODE);
sentryHandler.init();

Deno.serve(async (req) => {
  try {
    const lastFmUser = await getLastFmUser(req, env.LASTFM_USERNAME);
    const monitorSlug = `lastfm_library_artists_${lastFmUser.toLowerCase()}`;

    const result = await sentryHandler.withCronMonitor(
      monitorSlug,
      {
        schedule: { type: "crontab", value: "0 */2 * * *" },
        checkinMargin: 10,
        maxRuntime: 25,
        timezone: "UTC",
      },
      () => syncArtists(env, lastFmUser),
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
