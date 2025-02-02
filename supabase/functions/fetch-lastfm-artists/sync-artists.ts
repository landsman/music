import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { getLibraryArtists } from "../_shared/lastfm/library-artists.ts";
import { Variables } from "../_shared/env.ts";
import {ArtistRow, ArtistTable} from "../_shared/db/db.artist.ts";

/**
 * Sync database of artists with Last.fm
 */
export async function syncArtists(env: Variables, lastFmUser: string) {
  const supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  const artists = new ArtistTable(supabaseClient)

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

  if (count.total === 0) {
    console.log("Nothing new to save.");
    return "ok";
  }

  let processedPages = 0;
  let processedItems = 0;

  do {
    const fm = await getLibraryArtists(
        env.LASTFM_API_KEY,
        lastFmUser,
        size,
        count.page,
    );

    if (fm === null) {
      console.warn("Fail - No artists returned from api request.");
      break;
    }

    const toInsert: ArtistRow[] = fm.artists.artist
        .map((artist) => ({
          created_at: new Date().toISOString(),
          name: artist.name,
          lastfm_data: artist
        }));

    const {message, error} = await artists.sync(toInsert);
    if (error) {
      throw new Error(error.toString());
    }

    if (message) {
      console.log(message);
      processedItems = processedItems + toInsert.length;
    }

    processedPages++;
    count.page++;

  } while (count.page === count.totalPages);

  return "ok";
}
