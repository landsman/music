import "https://deno.land/std/dotenv/load.ts";
import { assertEquals } from "@std/assert";
import { buildCron } from "../_shared/cron.ts";
import { lastFmUserRecentTracksCron } from "../lastfm-user-recent-tracks/sync-tracks.ts";
import { lastFmLibraryArtistsCron } from "../lastfm-library-artists/sync-artists.ts";

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

/**
 * Use Deno tests to generate us the file.
 */
Deno.test(async function generateCronJobQuery() {
  const env = {
    PROJECT_ID: Deno.env.get("PROJECT_ID")!,
    PROJECT_PUBLISHABLE_KEY: Deno.env.get("PROJECT_PUBLISHABLE_KEY")!,
  };

  Deno.test("verify env variables exist", () =>
    Object.keys(env).forEach(
      (key) =>
        Deno.env.get(key) || (() => {
          throw new Error(`Missing environment variable: ${key}`);
        })(),
    ));

  const cronJobs = [
    lastFmUserRecentTracksCron(
      env.PROJECT_ID,
      env.PROJECT_PUBLISHABLE_KEY,
      "Insuit",
    ),
    lastFmUserRecentTracksCron(
      env.PROJECT_ID,
      env.PROJECT_PUBLISHABLE_KEY,
      "Weinkaa",
    ),
    lastFmLibraryArtistsCron(
      env.PROJECT_ID,
      env.PROJECT_PUBLISHABLE_KEY,
      "Insuit",
    ),
    lastFmLibraryArtistsCron(
      env.PROJECT_ID,
      env.PROJECT_PUBLISHABLE_KEY,
      "Weinkaa",
    ),
  ];

  const output = "--- Here are your CRON jobs, add them to database:\n" +
    cronJobs.join("\n");

  const outputFile = "cron_jobs.sql";

  Deno.writeTextFile(outputFile, output).then(() => {
    console.log(
      `Open file: ${outputFile} and put CRON job queries to your database.`,
    );
  });

  try {
    await Deno.stat(outputFile);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      throw new Error(`${outputFile} does not exist`);
    }
    throw error;
  }
});
