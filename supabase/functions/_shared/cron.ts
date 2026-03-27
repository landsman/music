import type { LastFmUser } from "./users.ts";

export interface CronDefinition {
  schedule: string;
  jobName: (user: LastFmUser) => string;
  edgeFunctionFolderName: string;
  body: (user: LastFmUser) => object;
}

/**
 * Generates SQL to safely remove a cron job if it exists.
 * Uses jobid lookup so it is a no-op when the job is not present.
 */
export function buildUnschedule(
  def: CronDefinition,
  user: LastFmUser,
): string {
  return `select cron.unschedule(jobid) from cron.job where jobname = '${
    def.jobName(user)
  }';\n`;
}

/**
 * Generates cron schedule SQL for a given definition and user.
 *
 * The anon key is never inlined — it is read at runtime from Supabase Vault
 * (vault.decrypted_secrets WHERE name = 'supabase_anon_key'), so the
 * generated SQL is safe to commit to a public repository.
 */
export function buildCron(
  def: CronDefinition,
  projectId: string,
  user: LastFmUser,
): string {
  const finalBody = {
    time: "', now(),'",
    ...def.body(user),
  };
  return `
select
  cron.schedule(
    '${def.jobName(user)}',
    '${def.schedule}',
    $$
    select
      net.http_post(
          url:='https://${projectId}.supabase.co/functions/v1/${def.edgeFunctionFolderName}',
          headers:=jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_anon_key')
          ),
          body:=concat('${JSON.stringify(finalBody)}')::jsonb
      ) as request_id;
    $$
  );
`;
}
