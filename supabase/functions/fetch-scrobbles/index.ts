import * as Sentry from "https://deno.land/x/sentry/index.mjs";
import { scrobbles } from "./scrobbles.ts";
import { env } from "./env.ts";

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

Deno.serve(async () => {
  try {
    const result = await scrobbles(env);
    return new Response(result, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (e) {
    Sentry.captureException(e);
    return new Response("error occured, please check sentry/supabase logs", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
});
