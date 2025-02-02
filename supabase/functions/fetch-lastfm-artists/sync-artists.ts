import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getLibraryArtists } from "../_shared/lastfm/library-artists.ts";
import { Variables } from "../_shared/env.ts";
import { ArtistRow, ArtistTable } from "../_shared/db/db.artist.ts";
import { delay } from "../_shared/utils.ts";

/**
 * Sync database of artists with Last.fm
 */
export async function syncArtists(env: Variables, lastFmUser: string) {
  console.log(`syncArtists - Last.fm user: ${lastFmUser}`);

  const supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  const artists = new ArtistTable(supabaseClient);

  const size = 100;
  const fmInitial = await getLibraryArtists(
    env.LASTFM_API_KEY,
    lastFmUser,
    size,
    1,
  );

  if (fmInitial === null) {
    throw new Error("Fail - No tracks returned from initial api request.");
  }

  const paginationInitial = fmInitial.artists["@attr"];

  // deno-lint-ignore prefer-const
  let count = {
    total: parseInt(paginationInitial.total),
    totalPages: parseInt(paginationInitial.totalPages),
    page: 1,
  };

  console.log("count", count);

  if (count.total === 0) {
    console.warn("Nothing to save, probably new last.fm account?");
    return "ok";
  }

  let processedPages = 0;
  let processedItems = 0;

  if (count.totalPages === 2) {
    console.log("Only one page. Stopping.");
    return "ok";
  }

  do {
    console.log(`Processing page ${count.page}/${count.totalPages}`);

    const fm = processedPages === 0 ? fmInitial : await getLibraryArtists(
      env.LASTFM_API_KEY,
      lastFmUser,
      size,
      count.page,
    );

    if (fm === null) {
      console.error("Fail - No artists returned from api request.");
      break;
    }

    const toInsert: ArtistRow[] = fm.artists.artist
      .map((artist) => ({
        created_at: new Date().toISOString(),
        name: artist.name,
        lastfm_data: artist,
      }));

    const { message, error } = await artists.sync(toInsert);
    if (error) {
      console.error(error);
      throw new Error(error.toString());
    }

    if (message) {
      console.log(message);
    }

    processedItems = processedItems + toInsert.length;
    console.log("Processed items:", processedItems);

    processedPages++;
    count.page++;

    // be good to api server
    await delay(500);
  } while (count.page <= count.totalPages);

  return "ok";
}
