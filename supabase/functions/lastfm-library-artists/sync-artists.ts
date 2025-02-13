import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  Artist,
  getLibraryArtists,
} from "../_shared/lastfm/library-artists.ts";
import { Variables } from "../_shared/env.ts";
import { ArtistRow, ArtistTable } from "../_shared/db/db.artist.ts";
import { delay, notEmptyOrNull } from "../_shared/utils.ts";
import { HoomanArtistTable } from "../_shared/db/db.hooman_artist.ts";
import { HoomanTable } from "../_shared/db/db.hooman.ts";

export async function syncArtists(env: Variables, lastFmUser: string) {
  console.log(`syncArtists - Last.fm user: ${lastFmUser}`);

  const supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  const artistsTable = new ArtistTable(supabaseClient);

  const hooman = new HoomanTable(supabaseClient);
  const hoomanId = await hooman.findOrCreateByLastFmUser(lastFmUser);
  const hoomanArtist = new HoomanArtistTable(supabaseClient);

  const size = 300;
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
    console.warn("Nothing to save, probably new last.fm account?");
    return "ok";
  }

  if (count.totalPages === 1) {
    console.log("Only one page. Stopping.");
    return "ok";
  }

  let processedPages = 0;
  let processedItems = 0;
  do {
    if (processedPages === count.totalPages) {
      console.log("syncArtists - successful!");
      return "ok";
    }

    if (processedPages % 2 === 0) {
      await delay(100);
    }

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

    const toInsert: ArtistRow[] = fm.artists.artist.map((item) => ({
      created_at: new Date().toISOString(),
      name: item.name,
      lastfm_id: notEmptyOrNull(item.mbid),
    }));

    const { message, error } = await artistsTable.sync(toInsert);
    if (error) {
      console.error("artist table sync error", error);
      throw new Error(error.toString());
    }

    if (message) {
      console.log(message);
    }

    await pairArtistWithHooman(
      artistsTable,
      hoomanArtist,
      hoomanId,
      fm.artists.artist,
    );

    processedItems = processedItems + toInsert.length;
    console.log("Processed items:", processedItems);

    processedPages++;
    count.page++;
  } while (count.page <= count.totalPages);
  return "ok";
}

async function pairArtistWithHooman(
  artistsTable: ArtistTable,
  hoomanArtistTable: HoomanArtistTable,
  hoomanId: string,
  data: Artist[],
): Promise<void> {
  const mapped = await Promise.all(data.map(async (item) => {
    const artistId = await artistsTable.findIdByName(item.name);
    if (artistId === null) {
      return null;
    }
    return {
      created_at: new Date().toISOString(),
      hooman_id: hoomanId,
      artist_id: artistId,
    };
  }));
  const toAssign = mapped.filter((r) => r !== null);

  const { message, error } = await hoomanArtistTable.pair(toAssign);
  if (error) {
    console.error("pair hooman to artist error", error);
    throw new Error(error.toString());
  }

  if (message) {
    console.log(message);
  }
}
