import "https://deno.land/std/dotenv/load.ts";
import { lastFmUserRecentTracksCron } from "../lastfm-user-recent-tracks/sync-tracks.ts";
import { lastFmLibraryArtistsCron } from "../lastfm-library-artists/sync-artists.ts";

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
