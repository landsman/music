import { assertEquals } from "@std/assert";
import { buildCron } from "../_shared/cron.ts";

Deno.test("buildCron should generate correct cron schedule SQL", () => {
  const props = {
    projectId: "myProject",
    publishableKey: "abc123",
    edgeFunctionFolderName: "myEdgeFunc",
    uniqueCronJobName: "jobName",
    cronTabTiming: "*/5 * * * *",
    body: { lastFmUser: "john" },
    headers: { "X-Custom": "customValue" },
  };

  const expectedHeaders = {
    "Content-Type": "application/json",
    "Authorization": "Bearer abc123",
    "X-Custom": "customValue",
  };

  const expectedBody = {
    time: "', now(),'",
    lastFmUser: "john",
  };

  const expected = `
select
  cron.schedule(
    'jobName',
    '*/5 * * * *',
    $$
    select
      net.http_post(
          url:='https://myProject.supabase.co/functions/v1/myEdgeFunc',
          headers:='${JSON.stringify(expectedHeaders)}'::jsonb,
          body:=concat('${JSON.stringify(expectedBody)}')::jsonb
      ) as request_id;
    $$
  );
`;

  const result = buildCron(props);
  assertEquals(result, expected);
});
