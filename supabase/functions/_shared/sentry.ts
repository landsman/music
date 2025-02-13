import * as Sentry from '@sentry/deno';

/**
 * Fatal error logging. Sentry will send an email about new errors.
 * Without that you are basically blind. Supabase does not have a way how to send error alerts from logs.
 */
export class SentryErrorHandler {
  private readonly isProduction: boolean = false;

  constructor(isProduction: boolean) {
    this.isProduction = isProduction;
  }

  init() {
    if (!this.isProduction) {
      return;
    }
    const projectName = Deno.env.get("PROJECT_NAME");
    Sentry.init({
      dsn: Deno.env.get("SENTRY_DSN")!,
      defaultIntegrations: false,
      tracesSampleRate: 1.0,
      // deno-lint-ignore ban-ts-comment
      // @ts-ignore
      profilesSampleRate: 1.0,

      // https://docs.sentry.io/platforms/javascript/guides/deno/configuration/integrations/rewriteframes/
      integrations: [Sentry.rewriteFramesIntegration(
        {
          root: `/${projectName}`,
          prefix: "",
          iteratee: (frame) => frame,
        },
      )],
    });
    // Set region and execution_id as custom tags
    Sentry.setTag("region", Deno.env.get("SB_REGION"));
    Sentry.setTag("execution_id", Deno.env.get("SB_EXECUTION_ID"));
    Sentry.setTag("url", Deno.env.get("SUPABASE_URL")!);
  }

  logFatalError(e: Error | unknown) {
    if (this.isProduction) {
      Sentry.captureException(e);
    }
    console.error(e);
  }
}
