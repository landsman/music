import { assertEquals } from "@std/assert";
import { buildCron, buildUnschedule, CronDefinition } from "../_shared/cron.ts";

const testCron: CronDefinition = {
  schedule: "*/5 * * * *",
  jobName: (user) => `test_job_${user.toLowerCase()}`,
  edgeFunctionFolderName: "my-edge-func",
  body: (user) => ({ lastFmUser: user }),
};

Deno.test("buildCron generates correct cron schedule SQL", () => {
  const result = buildCron(testCron, "myProject", "Insuit");

  const expectedBody = { time: "', now(),'", lastFmUser: "Insuit" };

  const expected = `
select
  cron.schedule(
    'test_job_insuit',
    '*/5 * * * *',
    $$
    select
      net.http_post(
          url:='https://myProject.supabase.co/functions/v1/my-edge-func',
          headers:=jsonb_build_object(
            'Content-Type', 'application/json',
            'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'supabase_anon_key')
          ),
          body:=concat('${JSON.stringify(expectedBody)}')::jsonb
      ) as request_id;
    $$
  );
`;

  assertEquals(result, expected);
});

Deno.test("buildCron lowercases user in job name", () => {
  const lower = buildCron(testCron, "myProject", "Insuit");
  const upper = buildCron(testCron, "myProject", "Insuit");
  assertEquals(lower, upper);
  assertEquals(lower.includes("test_job_insuit"), true);
});

Deno.test("buildUnschedule generates safe no-op SQL", () => {
  const result = buildUnschedule(testCron, "Insuit");
  assertEquals(
    result,
    "select cron.unschedule(jobid) from cron.job where jobname = 'test_job_insuit';\n",
  );
});
