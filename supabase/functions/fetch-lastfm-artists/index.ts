import { SentryErrorHandler } from "../_shared/sentry.ts";
import { env } from "../_shared/env.ts";
import { getLastFmUser } from "../_shared/lastfm/request-fields.ts";
import { syncArtists } from "./sync-artists.ts";
import { BeforeUnloadEvent, EdgeRuntime } from "../_shared/type.d.ts";

const sentryHandler = new SentryErrorHandler(env.DEVELOPER_MODE);
sentryHandler.init();

addEventListener("beforeunload", (ev: BeforeUnloadEvent) => {
  sentryHandler.logFatalError(
    `Function will be shutdown due to ${ev.detail?.reason}`,
  );
});

async function runInBackground(req: Request) {
  try {
    const lastFmUser = await getLastFmUser(req, env.LASTFM_USERNAME);
    await syncArtists(env, lastFmUser);
  } catch (e) {
    sentryHandler.logFatalError(e);
  }
}

Deno.serve((req) => {
  EdgeRuntime.waitUntil(runInBackground(req)).then(() => console.log("Done."));

  return new Response("ok");
});
