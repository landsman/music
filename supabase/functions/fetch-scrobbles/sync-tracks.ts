import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Variables } from "../_shared/env.ts";
import { HoomanTable } from "../_shared/db/db.hooman.ts";
import { ListenedRow, ListenedTable } from "../_shared/db/db.listened.ts";
import { getRecentTracks } from "../_shared/lastfm/user-recent-tracks.ts";

/**
 * Sync data from Last.fm to Supabase Database.
 */
export async function syncTracks(
  env: Variables,
  lastFmUser: string,
): Promise<string> {
  console.log(`syncTracks - Last.fm user: ${lastFmUser}`);

  const supabaseClient = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  const listened = new ListenedTable(supabaseClient);

  const hooman = new HoomanTable(supabaseClient);
  const hoomanId = await hooman.findOrCreateByLastFmUser(lastFmUser);

  const startFrom: number | null = await listened.getLastListenedDate(hoomanId);

  if (startFrom) {
    console.log(
      "Starting from last listened date:",
      new Date(startFrom * 1000).toLocaleString(),
    );
  } else {
    console.log("Database is empty, starting from the last page");
  }

  const size = 50;
  const fmInitial = await getRecentTracks(
    env.LASTFM_API_KEY,
    lastFmUser,
    1,
    size,
    startFrom,
  );
  if (fmInitial === null) {
    throw new Error("Fail - No tracks returned from initial api request.");
  }

  const paginationInitial = fmInitial.recenttracks["@attr"];
  const totalPages = parseInt(paginationInitial.totalPages);

  // deno-lint-ignore prefer-const
  let count = {
    total: parseInt(paginationInitial.total),
    page: totalPages,
  };

  if (count.total === 0) {
    console.log("Nothing new to save.");
    return "ok";
  }

  if (startFrom) {
    console.log(
      `Found ${count.total} new tracks to save! Starting from page ${totalPages}.`,
    );
  } else {
    console.log(
      `Found ${count.total} tracks in total. Starting from page ${totalPages}.`,
    );
  }

  let processedPages = 0;
  let processedItems = 0;
  do {
    // bee good to api server, download only a few pages and wait for the next invocation
    if (processedPages === 11) {
      console.log(
        `Already inserted ${processedItems} items to db. Stopped. See ya at next cron.`,
      );
      break;
    }

    const fm = await getRecentTracks(
      env.LASTFM_API_KEY,
      lastFmUser,
      count.page,
      size,
      startFrom,
    );
    if (fm === null) {
      console.warn("Fail - No tracks returned from api request.");
      break;
    }
    const data = fm.recenttracks;
    const tracks = data.track;

    if (count.total === 0 || tracks.length === 0) {
      break;
    }

    console.log(`Fetching page ${count.page}/${totalPages}`);

    const toInsert: ListenedRow[] = tracks
      .filter((track) => !(track["@attr"] && track["@attr"].nowplaying))
      .map((track) => ({
        created_at: new Date().toISOString(),
        listened_at: new Date(track.date!.uts * 1000).toISOString(),
        artist_name: track.artist.name,
        track_name: track.name,
        album_name: track.album["#text"],
        lastfm_data: track,
        hooman_id: hoomanId,
      }));

    const { error, message } = await listened.save(toInsert);
    if (error) {
      throw new Error(error.toString());
    }

    if (message) {
      console.log(message);
      processedItems = processedItems + toInsert.length;
    }

    processedPages++;
    count.page--;
  } while (count.page >= 1);

  return "ok";
}
