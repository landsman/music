import * as Sentry from "https://deno.land/x/sentry/index.mjs";
import { scrobbles } from "./scrobbles.ts";
import { env } from "./env.ts";

const isProduction = Deno.env.get("DEVELOPER_MODE") !== "true";

if (isProduction) {
  Sentry.init({
    dsn: Deno.env.get("SENTRY_DSN")!,
    defaultIntegrations: false,
    tracesSampleRate: 1.0,
    // deno-lint-ignore ban-ts-comment
    // @ts-ignore
    profilesSampleRate: 1.0,
  });

  // Set region and execution_id as custom tags
  Sentry.setTag("region", Deno.env.get("SB_REGION"));
  Sentry.setTag("execution_id", Deno.env.get("SB_EXECUTION_ID"));
  Sentry.setTag("url", env.SUPABASE_URL);
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();

    const lastFmUser = typeof body.lastFmUser === "string"
      ? body.lastFmUser
      : null;

    const result = await scrobbles(env, lastFmUser);

    return new Response(result, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (e) {
    if (isProduction) {
      Sentry.captureException(e);
    }
    console.error(e);
    return new Response("error occured, please check sentry/supabase logs", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
});
