import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { LastClient } from 'https://esm.sh/@musicorum/lastfm'

const env = {
    SUPABASE_URL: Deno.env.get("SUPABASE_URL")!,
    SUPABASE_ANON_KEY: Deno.env.get("SUPABASE_ANON_KEY")!,
    LASTFM_API_KEY: Deno.env.get("LASTFM_API_KEY")!,
    LASTFM_USERNAME: Deno.env.get("LASTFM_USERNAME")!,
}

export async function askLastfm(userName: string, page: number = 1): Promise<any> {
    const lastfmClient = new LastClient(env.LASTFM_API_KEY)
    const recentTracks = await lastfmClient.user.getRecentTracksPaginated(userName)
    return recentTracks.getPage(page)
}

Deno.serve(async () => {
    const result = await askLastfm(env.LASTFM_USERNAME, 1);
    console.log(result);


    //const supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
    //const scrobble = new Scrobble(supabaseClient);

    //const latestTimestamp = await scrobble.getLatestTimestamp();
    //console.log("Latest timestamp in DB:", latestTimestamp);

    // deno-lint-ignore prefer-const
    //let result: ScrobbleRow[] = [];

    let page = 1;
    let totalPages = 2;



    while (page <= totalPages) {

        //if (!data) break;
        // totalPages = parseInt(data.recenttracks["@attr"].totalPages, 10);
        // console.log(`Fetched page ${page}/${totalPages}`);
        //
        // const transformed = scrobble.transformTracks(data.recenttracks.track);
        //
        // if (latestTimestamp) {
        //     const newTracks = transformed.filter(track => {
        //         const trackTimestamp = Math.floor(new Date(track.timestamp).getTime() / 1000);
        //         return trackTimestamp > latestTimestamp;
        //     });
        //
        //     if (newTracks.length === 0) {
        //         break;
        //     }
        //
        //     allScrobbles.push(...newTracks);
        //
        //     const lastTrackTimestamp = Math.floor(new Date(newTracks[newTracks.length - 1].timestamp).getTime() / 1000);
        //     if (lastTrackTimestamp <= latestTimestamp) {
        //         break;
        //     }
        // } else {
        //     allScrobbles.push(...transformed);
        // }
        //
        // page++;
        // await delay(500); // Handle rate limiting
    }

    // console.log(`Found ${allScrobbles.length} new scrobbles`);
    //
    // const result = await scrobble.saveToSupabase(allScrobbles);

    return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
    });
});
